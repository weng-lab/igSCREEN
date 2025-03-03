"use client"
import React from "react"
import { useQuery } from "@apollo/client"
import Grid from "@mui/material/Grid2"
import { Link as MuiLink, Skeleton } from "@mui/material"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { gql } from "types/generated/gql"
import { GenomicRange } from "types/globalTypes"
import Link from "next/link"

export const NEARBY_GENOMIC_FEATURES_QUERY = gql(`
  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {
    gene(chromosome: $chromosome, start: $start, end: $end, assembly: "GRCh38", version: $version) {
      name
      strand
      transcripts {
        id
        coordinates {
          chromosome
          start
          end
        }
      }
    }

    iCREQuery(coordinates: $coordinates) {
      accession
      group
      coordinates {
        start
        end
        chromosome
      }
    }

    snpQuery(coordinates: $coordinates, assembly: "GRCh38", common: true) {
      id
      coordinates {
        chromosome
        start
        end
      }
    }
  }
`)

/**
 * 
 * @param region {chrom, start, end}
 * @param transcripts 
 * @returns distance to nearest TSS from any point in inputted region. 
 */
function calcDistToTSS(region: GenomicRange, transcripts: { id: string, coordinates: GenomicRange }[], strand: '+' | '-'): number {
  const distances: number[] = transcripts.map((transcript) => calcDistRegionToPosition(
    region.start,
    region.end,
    "closest",
    strand === "+" ? transcript.coordinates.start : transcript.coordinates.end
  ))
  return Math.min(...distances)
}

/**
 * 
 * @param start Start of Region
 * @param end End of Region
 * @param anchor The anchor of region to be used: start, end, middle, or closest (finds minimum of all anchors)
 * @param point Point to Find Distance to
 * @returns The distance from the anchor specified to the position
 */
function calcDistRegionToPosition(start: number, end: number, anchor: 'closest' | 'start' | 'end' | 'middle', point: number): number {
  const distToStart = Math.abs(start - point)
  const distToEnd = Math.abs(end - point)
  const distToMiddle = Math.abs(((start + end) / 2) - point)

  if (start <= point && point <= end) {
    return 0
  }

  switch (anchor) {
    case ('start'): return distToStart
    case ('end'): return distToEnd
    case ('middle'): return distToMiddle
    case ('closest'): return Math.min(distToStart, distToEnd, distToMiddle)
  }
}

/**
 * 
 * @param coord1 
 * @param coord2 
 * @returns the smallest distance from any point in either region
 */
export function calcDistRegionToRegion(coord1: { start: number, end: number }, coord2: { start: number, end: number }): number {
  if (coord1.end < coord2.start) {
    return coord2.start - coord1.end;
  } else if (coord2.end < coord1.start) {
    return coord1.start - coord2.end;
  } else {
    return 0;
  }
}

const NearbyGenomicFeatures = ({ coordinates }: { coordinates: GenomicRange }) => {

  const { loading, data, error } = useQuery(
    NEARBY_GENOMIC_FEATURES_QUERY,
    {
      variables:
      {
        //The coordinates need to be repeated twice since the nested queries take different inputs
        coordinates: {
          chromosome: coordinates.chromosome,
          start: coordinates.start - 1000000,
          end: coordinates.end + 1000000,
        },
        chromosome: coordinates.chromosome,
        start: coordinates.start - 1000000,
        end: coordinates.end + 1000000,
        version: 40
      },
    }
  )

  const genes = data?.gene.map((gene) => {
    return {
      ...gene,
      distance: calcDistToTSS(coordinates, gene.transcripts, gene.strand as "+" | "-")
    }
  })

  const iCREs = data?.iCREQuery.map((iCRE) => {
    return {
      ...iCRE,
      distance: calcDistRegionToRegion(coordinates, iCRE.coordinates),
    }
  })

  const snps = data?.snpQuery.map((snp) => {
    return {
      ...snp,
      distance: calcDistRegionToPosition(coordinates.start, coordinates.end, "closest", snp.coordinates.start),
    };
  });

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6, xl: 4 }} >
        {loading ?
          <Skeleton variant="rounded" width={"100%"} height={705} />
          :
          <DataTable
            columns={[
              {
                header: "Symbol",
                value: (row) => row.name,
                render: (row) => <MuiLink component={Link} href={'/gene/' + row.name}><i>{row.name}</i></MuiLink>
              },
              {
                header: "Distance to Nearest TSS (in bp)",
                value: (row) => row.distance,
                render: (row) => row.distance.toLocaleString("en-US"),
              },
            ]}
            rows={genes || []}
            sortColumn={1}
            tableTitle="Nearby Genes"
            itemsPerPage={10}
            searchable
            sortDescending={true}
          />
        }
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }} >
        {loading ?
          <Skeleton variant="rounded" width={"100%"} height={705} />
          :
          <DataTable
          columns={[
            {
              header: "Accession",
              value: (row) => row.accession,
              render: (row) => <MuiLink component={Link} href={'/icre/' + row.accession}>{row.accession}</MuiLink>
            },
            {
              header: "Distance (in bp)",
              value: (row) => row.distance,
              render: (row) => row.distance.toLocaleString("en-US"),
            },
          ]}
          rows={iCREs || []}
          sortColumn={1}
          tableTitle="Nearby iCREs"
          itemsPerPage={10}
          searchable
          sortDescending={true}
        />}
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }}>
        {loading ?
          <Skeleton variant="rounded" width={"100%"} height={705} />
          :
          <DataTable
            columns={[
              {
                header: "SNP ID",
                value: (row) => row.id,
                render: (row) => <MuiLink component={Link} href={'/snp/' + row.id}>{row.id}</MuiLink>
              },
              {
                header: "Distance (in bp)",
                value: (row) => row.distance,
                render: (row) => row.distance.toLocaleString("en-US"),
              },
            ]}
            sortColumn={1}
            tableTitle="Nearby SNPs"
            titleHoverInfo="Showing only common SNPs with allele frequency > 0.05"
            rows={snps || []}
            itemsPerPage={10}
            searchable
            sortDescending={true}
          />}
      </Grid>
    </Grid>
  );
}

export default NearbyGenomicFeatures
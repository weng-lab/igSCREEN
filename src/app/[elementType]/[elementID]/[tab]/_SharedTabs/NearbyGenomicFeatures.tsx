"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import Grid from "@mui/material/Grid2";
import { Link as MuiLink, Skeleton, Typography } from "@mui/material";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
import { gql } from "types/generated/gql";
import { GenomicElementType, GenomicRange } from "types/globalTypes";
import Link from "next/link";
import { calcDistToTSS, calcDistRegionToPosition, calcDistRegionToRegion, NearbyGenomicFeaturesProps } from "./utils";
import DataGridToolbar from "common/components/dataGridToolbar";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

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
`);

const NearbyGenomicFeatures = ({ coordinates, elementType, elementID }: NearbyGenomicFeaturesProps) => {
  const { loading, data, error } = useQuery(NEARBY_GENOMIC_FEATURES_QUERY, {
    variables: {
      //The coordinates need to be repeated twice since the nested queries take different inputs
      coordinates: {
        chromosome: coordinates.chromosome,
        start: coordinates.start - 1000000,
        end: coordinates.end + 1000000,
      },
      chromosome: coordinates.chromosome,
      start: coordinates.start - 1000000,
      end: coordinates.end + 1000000,
      version: 29,
    },
  });

  const genes = data?.gene
    .map((gene) => {
      return {
        ...gene,
        distance: calcDistToTSS(coordinates, gene.transcripts, gene.strand as "+" | "-"),
      };
    })
    .filter((gene) => {
      if (elementType === "gene") {
        return gene.name !== elementID;
      } else return true;
    });

  const iCREs = data?.iCREQuery
    .map((iCRE) => {
      return {
        ...iCRE,
        distance: calcDistRegionToRegion(coordinates, iCRE.coordinates),
      };
    })
    .filter((iCRE) => {
      if (elementType === "icre") {
        return iCRE.accession !== elementID;
      } else return true;
    });

  const snps = data?.snpQuery
    .map((snp) => {
      return {
        ...snp,
        distance: calcDistRegionToPosition(coordinates.start, coordinates.end, "closest", snp.coordinates.start),
      };
    })
    .filter((snp) => {
      if (elementType === "snp") {
        return snp.id !== elementID;
      } else return true;
    });

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6, xl: 4 }}>
        {loading ? (
          <Skeleton variant="rounded" width={"100%"} height={705} />
        ) : (
          <DataGrid
            rows={genes || []}
            columns={
              [
                {
                  field: "name",
                  headerName: "Symbol",
                  flex: 1,
                  renderCell: (params) => (
                    <MuiLink component={Link} href={"/gene/" + params.value}>
                      <i>{params.value}</i>
                    </MuiLink>
                  ),
                },
                distanceCol,
              ] as GridColDef[]
            }
            getRowId={(row) => row.name}
            initialState={{
              sorting: {
                sortModel: [{ field: "distance", sort: "asc" }],
              },
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            slots={{ toolbar: DataGridToolbar }}
            slotProps={{ toolbar: { title: "Nearby Genes" } }}
            density="compact"
            style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }}>
        {loading ? (
          <Skeleton variant="rounded" width={"100%"} height={705} />
        ) : (
          <DataGrid
            rows={iCREs || []}
            columns={
              [
                {
                  field: "accession",
                  headerName: "Accession",
                  flex: 1,
                  renderCell: (params) => (
                    <MuiLink component={Link} href={"/icre/" + params.value}>
                      {params.value}
                    </MuiLink>
                  ),
                },
                distanceCol,
              ] as GridColDef[]
            }
            getRowId={(row) => row.accession}
            initialState={{
              sorting: {
                sortModel: [{ field: "distance", sort: "asc" }],
              },
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            slots={{ toolbar: DataGridToolbar }}
            slotProps={{ toolbar: { title: "Nearby iCREs" } }}
            density="compact"
            style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }}>
        {loading ? (
          <Skeleton variant="rounded" width={"100%"} height={705} />
        ) : (
          <DataGrid
            rows={snps || []}
            columns={
              [
                {
                  field: "id",
                  headerName: "SNP ID",
                  flex: 1,
                  renderCell: (params) => (
                    <MuiLink component={Link} href={"/snp/" + params.value}>
                      {params.value}
                    </MuiLink>
                  ),
                },
                distanceCol,
              ] as GridColDef[]
            }
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "distance", sort: "asc" }],
              },
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            slots={{ toolbar: DataGridToolbar }}
            slotProps={{ toolbar: { title: "Nearby SNPs" } }}
            density="compact"
            style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
          />
        )}
      </Grid>
    </Grid>
  );
};

const distanceCol: GridColDef = {
  field: "distance",
  headerName: "Distance (in bp)",
  flex: 1,
  renderCell: (params) => {
    return params.value.toLocaleString();
  },
};

export default NearbyGenomicFeatures;

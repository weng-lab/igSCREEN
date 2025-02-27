"use client"
import React, { useMemo, useState, useRef, useCallback, useEffect } from "react"
import Grid2 from "@mui/material/Grid2"
import { RulerTrack, GenomeBrowser } from "umms-gb"
import Controls from "./controls"
import { gql, useQuery } from "@apollo/client"
import CytobandView, { GenomicRange } from "./cytobandview"
import EGeneTracks from "./egenetracks"
import { client } from "../utils"
import DefaultTracks from "./defaulttracks"
import BulkAtacTracks from "./bulkatactracks";
import ChromBPNetAtacTracks from "./chrombpnetatactracks";
import { Box } from "@mui/material"

type GenomeBrowserViewProps = {
  coordinates: {
    start: number
    end: number
    chromosome?: string
  }
  biosample?: string
  gene?: string
  defaultcelltypes?: string[]
  accession?: {
    name: string,
    start: number,
    end: number
  },
  assembly: string
}
const GENE_QUERY = gql`
  query s($chromosome: String, $start: Int, $end: Int, $assembly: String!,  $version: Int) {
    gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly, version :$version) {
      name
      strand
      transcripts {
        name
        strand
        exons {
          coordinates {
            chromosome
            start
            end
          }
        }
        coordinates {
          chromosome
          start
          end
        }
      }
    }
  }
`
export type Transcript = {
  id: string
  name: string
  strand: string
  coordinates: GenomicRange
}
export type SNPQueryResponse = {
  gene: {
    name: string
    strand: string
    transcripts: Transcript[]
  }[]
}
export function expandCoordinates(coordinates, l = 20000) {
  return {
    chromosome: coordinates.chromosome,
    start: coordinates.start - l < 0 ? 0 : coordinates.start - l,
    end: coordinates.end + l,
  }
}

export const GenomeBrowserView: React.FC<GenomeBrowserViewProps> = (props: GenomeBrowserViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const expandedCoordinates = useMemo(() => expandCoordinates(props.coordinates), [props.coordinates])
  const [coordinates, setCoordinates] = useState<GenomicRange>(expandedCoordinates)
  const [highlight, setHighlight] = useState(null)

  const snpResponse = useQuery<SNPQueryResponse>(GENE_QUERY, {
    variables: { ...coordinates, assembly: props.assembly, version: 40 },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  const groupedTranscripts = useMemo(
    () =>
      snpResponse.data?.gene.map((x) => ({
        ...x,
        transcripts: x.transcripts.map((xx) => ({
          ...xx,
          color: props.gene ? (x.name.includes(props.gene) ? "#880000" : "#aaaaaa") : "#aaaaaa",
        })),
      })),
    [snpResponse, props.gene]
  )
  const onDomainChanged = useCallback(
    (d: GenomicRange) => {
      const chr = d.chromosome === undefined ? props.coordinates.chromosome : d.chromosome
      const start = Math.round(d.start)
      const end = Math.round(d.end)
      if (end - start > 10) {
        setCoordinates({ chromosome: chr, start, end })
      }
    },
    [props.coordinates]
  )
  const l = useCallback((c) => ((c - coordinates.start) * 1400) / (coordinates.end - coordinates.start), [coordinates])

  return (<>
    <Grid2 container spacing={3} sx={{ mt: "1rem", mb: "1rem" }}>
      <Grid2
        size={{
          xs: 12,
          lg: 12
        }}>
        <br />
        <CytobandView innerWidth={1000} height={15} chromosome={coordinates.chromosome!} assembly={"hg38"} position={coordinates} />
        <br />
        <div style={{ textAlign: "center" }}>
          <Controls onDomainChanged={onDomainChanged} domain={coordinates || props.coordinates} />
        </div>
        <br />
        <br />
        <Box id="GB">
          <GenomeBrowser
          svgRef={svgRef}      
          domain={coordinates}
          innerWidth={1400}
          width="100%"
          noMargin
          onDomainChanged={(x) => {
            if (Math.ceil(x.end) - Math.floor(x.start) > 10) {
              setCoordinates({
                chromosome: coordinates.chromosome,
                start: Math.floor(x.start),
                end: Math.ceil(x.end),
              })
            }
          }}
        >
          {highlight && (
            <rect fill="#8ec7d1" fillOpacity={0.5} height={'100%'} x={l(highlight.start)} width={l(highlight.end) - l(highlight.start)} />
          )}
          <RulerTrack domain={coordinates} height={30} width={1400} />
          <>
            {props.accession && <rect fill="#FAA4A4" fillOpacity={0.3} height={'100%'} x={l(props.accession.start)} width={l(props.accession.end) - l(props.accession.start)} />
            }
          </>
          <EGeneTracks
            genes={groupedTranscripts || []}
            expandedCoordinates={coordinates}
            squish={coordinates.end - coordinates.start >= 500000 ? true : false}
          />
          <DefaultTracks
            assembly={props.assembly}
            domain={coordinates}
            oncCREMousedOver={(x) => x && setHighlight(x)}
            oncCREMousedOut={() => setHighlight(null)}
          />
          <BulkAtacTracks
            assembly="GRCh38"
            domain={coordinates}
            defaultcelltypes={props.defaultcelltypes}
          />
          {
            /**
             * @todo Need to make sure chrombpnet tracks also include Corces 
             */
          }
          {/* <ChromBPNetAtacTracks
            domain={coordinates}
            defaultcelltypes={props.defaultcelltypes}
          /> */}
        </GenomeBrowser>
        </Box>
        
      </Grid2>
    </Grid2>
  </>);
}

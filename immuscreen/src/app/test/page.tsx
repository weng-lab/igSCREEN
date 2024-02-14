'use client'
import * as React from "react"
import CellTypeTree from "../../common/components/cellTypeTree"
import Grid2 from "@mui/material/Unstable_Grid2"
import CytobandView from "../../common/gbview/cytobandview"
import Controls from "../../common/gbview/controls"
import { GenomeBrowser, RulerTrack } from "umms-gb"
import { useCallback, useMemo, useRef, useState } from "react"
import BulkAtacTracks from "../../common/gbview/bulkatactracks"

type GenomeBrowserViewProps = {
  coordinates: {
    start: number
    end: number
    chromosome?: string
  }
  biosample?: string
  gene?: string
  assembly: string
}

type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
}

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
export default function Test() {
  const defaultCoords = {
    start: 5205263,
    end: 5381894,
    chromosome: "chr11"
  }

  const svgRef = useRef<SVGSVGElement>(null)
  const expandedCoordinates = useMemo(() => expandCoordinates(defaultCoords), [defaultCoords])

  const [coordinates, setCoordinates] = useState<GenomicRange>(expandedCoordinates)
  const [highlight, setHighlight] = useState(null)


  const onDomainChanged = useCallback(
    (d: GenomicRange) => {
      const chr = d.chromosome === undefined ? defaultCoords.chromosome : d.chromosome
      const start = Math.round(d.start)
      const end = Math.round(d.end)
      if (end - start > 10) {
        setCoordinates({ chromosome: chr, start, end })
      }
    },
    [defaultCoords]
  )
  const l = useCallback((c) => ((c - coordinates.start) * 1400) / (coordinates.end - coordinates.start), [coordinates])


  return (
    <>
      <Grid2 container spacing={3} sx={{ mt: "1rem", mb: "1rem" }}>
        <Grid2 xs={12} lg={12}>
          <br />
          <CytobandView innerWidth={1000} height={15} chromosome={coordinates.chromosome!} assembly={"hg38"} position={coordinates} />
          <br />
          <div style={{ textAlign: "center" }}>
            <Controls onDomainChanged={onDomainChanged} domain={coordinates || defaultCoords} />
          </div>
          <br />
          <br />
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
              <rect fill="#8ec7d1" fillOpacity={0.5} height={1000} x={l(highlight.start)} width={l(highlight.end) - l(highlight.start)} />
            )}
            <RulerTrack domain={coordinates} height={30} width={1400} />
            <BulkAtacTracks
              assembly="GRCh38"
              domain={coordinates}
            />
          </GenomeBrowser>
        </Grid2>
      </Grid2>
    </>
  )
}

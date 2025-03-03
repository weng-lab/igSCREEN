"use client"
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react"
import Grid2 from "@mui/material/Grid2"
import { Box, Button, IconButton } from "@mui/material"
import { BrowserActionType, TrackType, GQLCytobands, useBrowserState, TranscriptTrackProps, TranscriptHumanVersion, TranscriptMouseVersion, DefaultTranscript, DefaultBigBed, DisplayMode, BigBedTrackProps, GQLWrapper, DefaultBigWig, Controls, GenomeBrowser } from '@weng-lab/genomebrowser';
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types"
import { CellQueryValue } from "../../app/celllineage/types"
import BulkAtacModal from "./bulkAtacSelector"
import { getCellDisplayName } from "../../app/celllineage/utils"
import { getCellColor } from "../../app/celllineage/utils"
import { Search } from "@mui/icons-material"
import { GenomeSearch, Result } from "@weng-lab/psychscreen-ui-components"
import { GenomicRange } from "./types";
import AutoComplete from "../components/mainsearch/autocomplete";

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
function expandCoordinates(coordinates, l = 20000) {
  return {
    chromosome: coordinates.chromosome,
    start: coordinates.start - l < 0 ? 0 : coordinates.start - l,
    end: coordinates.end + l,
  }
}

export const GenomeBrowserView: React.FC<GenomeBrowserViewProps> = (props: GenomeBrowserViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const expandedCoordinates = useMemo(() => expandCoordinates(props.coordinates), [props.coordinates])
  const [coordinates, setCoordinates] = useState<GenomicRange>(expandedCoordinates)

  // Browser State
  const initialBrowserCoords = useMemo(() => {
    return coordinates
  }, [coordinates])

  const initialDomain = useMemo(() => {
    return ({
      chromosome: initialBrowserCoords.chromosome,
      start: initialBrowserCoords.start,
      end: initialBrowserCoords.end
    })
  }, [initialBrowserCoords.chromosome, initialBrowserCoords.end, initialBrowserCoords.start])

  const bedMouseOver = useCallback((item: Rect) => {
    const newHighlight = { domain: { start: item.start + 150, end: item.end + 150 }, color: item.color || "red", id: item.name }
    browserDispatch({ type: BrowserActionType.ADD_HIGHLIGHT, highlight: newHighlight })
  }, [])
  const bedMouseOut = useCallback(() => {
    browserDispatch({ type: BrowserActionType.REMOVE_LAST_HIGHLIGHT })
  }, [])

  const initialTracks = useMemo(() => {
    if (!props.assembly) return []
    const geneTrack = {
      ...DefaultTranscript,
      titleSize: 16,
      id: "default-gene",
      title: "GENCODE genes",
      height: 100,
      color: "#AAAAAA",
      version: props.assembly.toLowerCase() === "mm10" ? TranscriptMouseVersion.V25 : TranscriptHumanVersion.V47,
      assembly: props.assembly,
      queryType: "gene",
      displayMode: DisplayMode.SQUISH,
      geneName: props.gene
    } as TranscriptTrackProps

    const icreTrack = {
      ...DefaultBigBed,
      titleSize: 16,
      id: "default-icre",
      title: "All Immune cCres",
      displayMode: DisplayMode.DENSE,
      color: "#9378bc",
      rowHeight: 20,
      height: 75,
      onMouseOver: bedMouseOver,
      onMouseOut: bedMouseOut,
      url: "https://downloads.wenglab.org/Calderon-Corces_activeCREs_iSCREEN_withcolors.bigBed"
    } as BigBedTrackProps

    const allImmuneBigWig = {
      ...DefaultBigWig,
      title: "All Immune Cells (Aggregate Signal)",
      url: "https://downloads.wenglab.org/all_immune.bigWig",
      color: "#000000",
      height: 75,
      rowHeight: 12,
      displayMode: DisplayMode.FULL,
      id: "all-immune-bigwig"
    }

    return [geneTrack, icreTrack, allImmuneBigWig]
  }, [props.gene, props.assembly, bedMouseOver, bedMouseOut])

  const initialBrowserState = useMemo(() => {
    return {
      domain: initialDomain,
      width: 1500,
      tracks: initialTracks,
      highlights: []
    }
  }, [initialDomain, initialTracks])

  const [browserState, browserDispatch] = useBrowserState(initialBrowserState)
  const [browserInitialized, setBrowserInitialized] = useState(props.coordinates ? true : false)

  //Initialize genome browser if coordinates were missing initially
  useEffect(() => {
    if (!browserInitialized && props.coordinates) {
      const tracks = initialTracks;
      browserDispatch({ type: BrowserActionType.SET_DOMAIN, domain: initialDomain });
      console.log(tracks)
      tracks.forEach((track) => {
        if (!browserState.tracks.find(t => t.id === track.id)) {
          browserDispatch({ type: BrowserActionType.ADD_TRACK, track })
        }
        if (track.trackType === TrackType.TRANSCRIPT) {
          browserDispatch({
            type: BrowserActionType.UPDATE_PROPS, id: track.id,
            props: {
              geneName: props.gene
            }
          })
        }
      });
      // Mark as initialized
      setBrowserInitialized(true);
    }
  }, [browserDispatch, browserInitialized, browserState.tracks, coordinates, initialDomain, initialTracks, props.coordinates, props.gene]);

  // Bulk ATAC Modal
  const [settingsModalShown, setSettingsModalShown] = useState(false)
  const [selectedCells, setSelectedCells] = useState<CellQueryValue[]>([])

  useEffect(() => {
    // Remove only bulk ATAC tracks for deselected cells
    console.log(selectedCells)
    browserState.tracks.forEach(track => {
      if (track.id === "all-immune-bigwig" || track.id === "default-icre" || track.id === "default-gene") return
      if (!selectedCells.some(cell => cell === track.id)) {
        console.log("deleting", track.id)
        browserDispatch({ type: BrowserActionType.DELETE_TRACK, id: track.id })
      }
    })
    // Add tracks for selected cells
    const x: [string, string, string][] = selectedCells.map(cell => {
      return ([
        getCellDisplayName(cell, true, true) + (["HSC", "CD34_Cord_Blood", "CD34_Bone_Marrow"].find(x => x === cell) ? ` (${cell})` : ''),
        `https://downloads.wenglab.org/${cell}.bigWig`,
        getCellColor(cell)
      ])
    }) || []
    x.map((cell, index) => {
      if (!browserState.tracks.find(t => t.id === selectedCells[index])) {
        const track = {
          ...DefaultBigWig,
          title: cell[0],
          url: cell[1],
          color: cell[2],
          height: 75,
          displayMode: DisplayMode.FULL,
          id: selectedCells[index]
        }
        console.log(track)
        browserDispatch({ type: BrowserActionType.ADD_TRACK, track })
      }
    })
  }, [selectedCells, browserState.tracks, browserDispatch])

  const handeSearchSubmit = (r: Result) => {
    console.log(r)
  }

  return (
    <GQLWrapper>
      <Grid2 container spacing={3} sx={{ mt: "0rem", mb: "1rem" }} ref={containerRef} justifyContent="center" alignItems="center">
        <Grid2 size={{ xs: 12, lg: 12 }} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "0px" }}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", mb: 2 }}>
            <AutoComplete
              assembly="GRCh38"
              onSearchSubmit={handeSearchSubmit}
              queries={["gene", "snp", "icre"]}
              geneLimit={3}
              sx={{ width: "400px" }}
            />
            <Button variant="contained" onClick={() => setSettingsModalShown(true)}>
              Add more ATAC-seq data
            </Button>
          </Box>
          <BulkAtacModal
            open={settingsModalShown}
            onCancel={() => setSettingsModalShown(false)}
            onAccept={(cells: CellQueryValue[]) => {
              setSelectedCells(cells);
              setSettingsModalShown(false)
            }}
            selected={selectedCells}
          />
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
            {props.assembly} at {browserState.domain.chromosome}:{browserState.domain.start.toLocaleString()}-{browserState.domain.end.toLocaleString()}
          </h3>

          <svg id="cytobands" width={"700px"} height={20}>
            <GQLCytobands assembly={props.assembly === "GRCh38" ? "hg38" : "mm10"} chromosome={browserState.domain.chromosome} currentDomain={browserState.domain} />
          </svg>
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 12 }}>
          <Controls
            inputButtonComponent={
              <IconButton type="button" sx={{
                color: "black",
                maxHeight: "100%",
                padding: "4px"
              }}>
                <Search fontSize="small" />
              </IconButton>
            }
            buttonComponent={
              <Button
                variant="outlined"
                sx={{
                  minWidth: "0px",
                  width: { xs: "100%", sm: "80%" },
                  maxWidth: "120px",
                  fontSize: "0.8rem",
                  padding: "4px 8px"
                }}
              />
            }
            domain={browserState.domain}
            dispatch={browserDispatch}
            withInput={false}
            style={{
              paddingBottom: "4px",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              width: "100%"
            }}
          />
          <GenomeBrowser width={"100%"} browserState={browserState} browserDispatch={browserDispatch} />
        </Grid2>
      </Grid2 >
    </GQLWrapper>
  );
}
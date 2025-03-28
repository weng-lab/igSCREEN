"use client";
import { Search } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import {
  BigBedTrackProps,
  BrowserActionType,
  DefaultBigBed,
  DefaultBigWig,
  DefaultTranscript,
  DisplayMode,
  GenomeBrowser,
  GQLCytobands,
  TrackType,
  TranscriptHumanVersion,
  TranscriptMouseVersion,
  TranscriptTrackProps,
  useBrowserState,
} from "@weng-lab/genomebrowser";
import { Result } from "@weng-lab/psychscreen-ui-components";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
import { CellQueryValue } from "../../app/celllineage/types";
import { getCellColor, getCellDisplayName } from "../../app/celllineage/utils";
import AutoComplete from "../components/autocomplete";
import BulkAtacModal from "./bulkAtacSelector";
import { GenomicRange } from "./types";
import ControlButtons from "./controls";

type Highlight = {
  domain: {
    chromosome: string;
    start: number;
    end: number;
  };
  color: string;
  id: string;
};

type GenomeBrowserViewProps = {
  coordinates: {
    start: number;
    end: number;
    chromosome?: string;
  };
  biosample?: string;
  gene?: string;
  defaultcelltypes?: string[];
  accession?: {
    name: string;
    start: number;
    end: number;
  };
  assembly: string;
  highlights?: Highlight[];
};

export type Transcript = {
  id: string;
  name: string;
  strand: string;
  coordinates: GenomicRange;
};
export type SNPQueryResponse = {
  gene: {
    name: string;
    strand: string;
    transcripts: Transcript[];
  }[];
};
function expandCoordinates(coordinates, l = 20000) {
  return {
    chromosome: coordinates.chromosome,
    start: coordinates.start - l < 0 ? 0 : coordinates.start - l,
    end: coordinates.end + l,
  };
}

export const GenomeBrowserView: React.FC<GenomeBrowserViewProps> = (
  props: GenomeBrowserViewProps
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedCoordinates = useMemo(
    () => expandCoordinates(props.coordinates),
    [props.coordinates]
  );
  const [coordinates, setCoordinates] =
    useState<GenomicRange>(expandedCoordinates);

  // Browser State
  const initialBrowserCoords = useMemo(() => {
    return coordinates;
  }, [coordinates]);

  const initialDomain = useMemo(() => {
    return {
      chromosome: initialBrowserCoords.chromosome,
      start: initialBrowserCoords.start,
      end: initialBrowserCoords.end,
    };
  }, [
    initialBrowserCoords.chromosome,
    initialBrowserCoords.end,
    initialBrowserCoords.start,
  ]);

  const icreMouseOver = useCallback((item: Rect) => {
    const newHighlight = {
      domain: { start: item.start + 150, end: item.end + 150 },
      color: item.color || "red",
      id: item.name,
    };
    browserDispatch({
      type: BrowserActionType.ADD_HIGHLIGHT,
      highlight: newHighlight,
    });
  }, []);
  const icreMouseOut = useCallback(() => {
    browserDispatch({ type: BrowserActionType.REMOVE_LAST_HIGHLIGHT });
  }, []);

  const onIcreClick = useCallback((item: Rect) => {
    const accession = item.name
    window.open(`/icre/${accession}/nearby`, '_blank')
  }, []);

  const initialTracks = useMemo(() => {
    if (!props.assembly) return [];
    const geneTrack = {
      ...DefaultTranscript,
      titleSize: 16,
      id: "default-gene",
      title: "GENCODE genes",
      height: 100,
      color: "#AAAAAA",
      version:
        props.assembly.toLowerCase() === "mm10"
          ? TranscriptMouseVersion.V25
          : TranscriptHumanVersion.V29,
      assembly: props.assembly,
      queryType: "gene",
      displayMode: DisplayMode.SQUISH,
      geneName: props.gene,
    } as TranscriptTrackProps;

    const icreTrack = {
      ...DefaultBigBed,
      titleSize: 16,
      id: "default-icre",
      title: "All Immune cCres",
      displayMode: DisplayMode.DENSE,
      color: "#9378bc",
      rowHeight: 20,
      height: 75,
      onMouseOver: icreMouseOver,
      onMouseOut: icreMouseOut,
      onClick: onIcreClick,
      url: "https://downloads.wenglab.org/Calderon-Corces_activeCREs_iSCREEN_withcolors.bigBed",
    } as BigBedTrackProps;

    const allImmuneBigWig = {
      ...DefaultBigWig,
      title: "All Immune Cells (Aggregate Signal)",
      url: "https://downloads.wenglab.org/all_immune.bigWig",
      color: "#000000",
      height: 75,
      rowHeight: 12,
      displayMode: DisplayMode.FULL,
      id: "all-immune-bigwig",
    };

    return [geneTrack, icreTrack, allImmuneBigWig];
  }, [props.gene, props.assembly, icreMouseOver, icreMouseOut, onIcreClick]);

  const initialBrowserState = useMemo(() => {
    return {
      domain: initialDomain,
      width: 1500,
      tracks: initialTracks,
      highlights: props.highlights || [],
    };
  }, [initialDomain, initialTracks, props.highlights]);

  const [browserState, browserDispatch] = useBrowserState(initialBrowserState);
  const [browserInitialized, setBrowserInitialized] = useState(
    props.coordinates ? true : false
  );

  //Initialize genome browser if coordinates were missing initially
  useEffect(() => {
    if (!browserInitialized && props.coordinates) {
      const tracks = initialTracks;
      browserDispatch({
        type: BrowserActionType.SET_DOMAIN,
        domain: initialDomain,
      });
      // console.log(tracks);
      tracks.forEach((track) => {
        if (!browserState.tracks.find((t) => t.id === track.id)) {
          browserDispatch({ type: BrowserActionType.ADD_TRACK, track });
        }
        if (track.trackType === TrackType.TRANSCRIPT) {
          browserDispatch({
            type: BrowserActionType.UPDATE_PROPS,
            id: track.id,
            props: {
              geneName: props.gene,
            },
          });
        }
      });
      // Mark as initialized
      setBrowserInitialized(true);
    }
  }, [
    browserDispatch,
    browserInitialized,
    browserState.tracks,
    coordinates,
    initialDomain,
    initialTracks,
    props.coordinates,
    props.gene,
  ]);

  // Bulk ATAC Modal
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [selectedCells, setSelectedCells] = useState<CellQueryValue[]>([]);

  useEffect(() => {
    // Remove only bulk ATAC tracks for deselected cells
    browserState.tracks.forEach((track) => {
      if (
        track.id === "all-immune-bigwig" ||
        track.id === "default-icre" ||
        track.id === "default-gene"
      )
        return;
      if (!selectedCells.some((cell) => cell === track.id)) {
        // console.log("deleting", track.id);
        browserDispatch({ type: BrowserActionType.DELETE_TRACK, id: track.id });
      }
    });
    // Add tracks for selected cells
    const x: [string, string, string][] =
      selectedCells.map((cell) => {
        return [
          getCellDisplayName(cell, true, true) +
            (["HSC", "CD34_Cord_Blood", "CD34_Bone_Marrow"].find(
              (x) => x === cell
            )
              ? ` (${cell})`
              : ""),
          `https://downloads.wenglab.org/${cell}.bigWig`,
          getCellColor(cell),
        ];
      }) || [];
    x.map((cell, index) => {
      if (!browserState.tracks.find((t) => t.id === selectedCells[index])) {
        const track = {
          ...DefaultBigWig,
          title: cell[0],
          url: cell[1],
          color: cell[2],
          height: 75,
          displayMode: DisplayMode.FULL,
          id: selectedCells[index],
        };
        // console.log(track);
        browserDispatch({ type: BrowserActionType.ADD_TRACK, track });
      }
    });
  }, [selectedCells, browserState.tracks, browserDispatch]);

  const handeSearchSubmit = (r: Result) => {
    if (r.type === "Gene") {
      browserDispatch({
        type: BrowserActionType.UPDATE_PROPS,
        id: "default-gene",
        props: {
          geneName: r.title,
        },
      });
    }
    const expandedCoordinates = expandCoordinates(r.domain);
    browserDispatch({
      type: BrowserActionType.SET_DOMAIN,
      domain: expandedCoordinates,
    });
  };

  const theme = useTheme();
  
  return (
    <Grid2
      container
      spacing={3}
      sx={{ mt: "0rem", mb: "1rem" }}
      ref={containerRef}
      justifyContent="center"
      alignItems="center"
    >
      <Grid2
        size={{ xs: 12, lg: 12 }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <AutoComplete
            size="small"
            assembly="GRCh38"
            onSearchSubmit={handeSearchSubmit}
            queries={["Gene", "SNP", "iCRE", "Coordinate"]}
            geneLimit={3}
            sx={{ width: "400px" }}
            slots={{
              button: (
                <IconButton sx={{ color: theme.palette.primary.main }}>
                  <Search />
                </IconButton>
              ),
            }}
            slotProps={{
              input: {
                label: "Change browser region",
                sx: {
                  backgroundColor: "white",
                  "& label.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
            }}
            onClick={() => setSettingsModalShown(true)}
          >
            Add more ATAC-seq data
          </Button>
        </Box>
        <BulkAtacModal
          open={settingsModalShown}
          onCancel={() => setSettingsModalShown(false)}
          onAccept={(cells: CellQueryValue[]) => {
            setSelectedCells(cells);
            setSettingsModalShown(false);
          }}
          selected={selectedCells}
        />
        <Box
          width={"100%"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          display={"flex"}
          alignItems={"center"}
        >
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
            {browserState.domain.chromosome}:
            {browserState.domain.start.toLocaleString()}-
            {browserState.domain.end.toLocaleString()}
          </h3>

          <svg id="cytobands" width={"700px"} height={20}>
            <GQLCytobands
              assembly={props.assembly === "GRCh38" ? "hg38" : "mm10"}
              chromosome={browserState.domain.chromosome}
              currentDomain={browserState.domain}
            />
          </svg>
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>hg38</h3>
        </Box>
        <ControlButtons
          browserState={browserState}
          browserDispatch={browserDispatch}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 12 }}>
        <GenomeBrowser
          width={"100%"}
          browserState={browserState}
          browserDispatch={browserDispatch}
        />
      </Grid2>
      <Box
          sx={{
            width: "100%",
            height: 40,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
        {/* Lower button, commented out for now because it doesn't seem necessary atm */}
        {/* <Button 
          variant="contained"
          startIcon={<EditIcon />}
          size="small"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
          onClick={() => setSettingsModalShown(true)}
        >
          Add more ATAC-seq data
        </Button> */}
      </Box>
    </Grid2>
  );
};

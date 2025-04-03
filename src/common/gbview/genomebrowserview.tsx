"use client";
import { Search } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  DialogTitle,
  Dialog,
  IconButton,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import {
  BigBedTrackProps,
  BigWigTrackProps,
  BrowserActionType,
  DefaultBigBed,
  DefaultBigWig,
  DefaultTranscript,
  DisplayMode,
  GenomeBrowser,
  GQLCytobands,
  TranscriptHumanVersion,
  TranscriptTrackProps,
  useBrowserState,
} from "@weng-lab/genomebrowser";
import { GenomeSearch, Result } from "@weng-lab/psychscreen-ui-components";
import React, { useCallback, useEffect, useState } from "react";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
import { GenomicRange } from "./types";
import ControlButtons from "./controls";
import { GenomicElementType } from "types/globalTypes";
import HighlightIcon from "@mui/icons-material/Highlight";
import HighlightDialog, { GBHighlight } from "./highlightDialog";
import AddTracksModal from "./addTracksModal";

function expandCoordinates(coordinates: GenomicRange) {
  let length = coordinates.end - coordinates.start;
  if (length <= 100) {
    length = 100;
  }
  const padding = Math.floor(length * 0.25);
  return {
    chromosome: coordinates.chromosome,
    start: coordinates.start - padding,
    end: coordinates.end + padding,
  };
}

export default function GenomeBrowserView({
  coordinates,
  name,
  type,
}: {
  coordinates: GenomicRange;
  name: string;
  type: GenomicElementType;
}) {
  const [browserState, browserDispatch] = useBrowserState({
    domain: expandCoordinates(coordinates),
    width: 1500,
    tracks: [],
    highlights: [],
  });

  // Bed track mouse over, out, and click handlers
  const icreMouseOver = useCallback(
    (item: Rect) => {
      const newHighlight = {
        domain: { start: item.start + 150, end: item.end + 150 },
        color: item.color || "red",
        id: item.name,
      };
      browserDispatch({
        type: BrowserActionType.ADD_HIGHLIGHT,
        highlight: newHighlight,
      });
    },
    [browserDispatch]
  );
  const icreMouseOut = useCallback(() => {
    browserDispatch({ type: BrowserActionType.REMOVE_LAST_HIGHLIGHT });
  }, [browserDispatch]);
  const onIcreClick = useCallback((item: Rect) => {
    const accession = item.name;
    window.open(`/icre/${accession}/nearby`, "_blank");
  }, []);

  // Initialize tracks and highlights
  useEffect(() => {
    const tracks = defaultTracks(type === "gene" ? name : "", icreMouseOver, icreMouseOut, onIcreClick);
    tracks.forEach((track) => {
      browserDispatch({ type: BrowserActionType.ADD_TRACK, track });
    });
    browserDispatch({
      type: BrowserActionType.ADD_HIGHLIGHT,
      highlight: {
        domain: {
          chromosome: coordinates.chromosome,
          start: coordinates.start,
          end: coordinates.end,
        },
        color: "blue",
        id: name,
      },
    });
  }, [coordinates, name, type, icreMouseOver, icreMouseOut, onIcreClick, browserDispatch]);

  // Bulk ATAC Modal
  const [showAddTracksModal, setShowAddTracksModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<BigWigTrackProps[]>([]);

  useEffect(() => {
    // Add new tracks that aren't already in browser state
    selectedTracks.forEach((track) => {
      if (!browserState.tracks.some((t) => t.id === track.id)) {
        browserDispatch({ type: BrowserActionType.ADD_TRACK, track });
      }
    });

    // Remove tracks that are no longer selected
    browserState.tracks.forEach((track) => {
      if (track.id?.includes("_merged_signal") && !selectedTracks.some((t) => t.id === track.id)) {
        browserDispatch({ type: BrowserActionType.DELETE_TRACK, id: track.id });
      }
    });
  }, [browserState.tracks, selectedTracks, browserDispatch]);

  const handeSearchSubmit = (r: Result) => {
    browserDispatch({
      type: BrowserActionType.SET_LOADING,
    });
    if (r.type === "Gene") {
      browserDispatch({
        type: BrowserActionType.UPDATE_PROPS,
        id: "default-gene",
        props: {
          geneName: r.title,
        },
      });
    }
    // Only remove if there is more than one highlight
    if (browserState.highlights.length > 1) {
      browserDispatch({
        type: BrowserActionType.REMOVE_LAST_HIGHLIGHT,
      });
    }
    browserDispatch({
      type: BrowserActionType.ADD_HIGHLIGHT,
      highlight: {
        domain: r.domain,
        color: randomColor(),
        id: r.title,
      },
    });
    browserDispatch({
      type: BrowserActionType.SET_DOMAIN,
      domain: expandCoordinates(r.domain),
    });
  };

  const theme = useTheme();
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);

  return (
    <Grid2 container spacing={2} sx={{ mt: "0rem", mb: "1rem" }} justifyContent="center" alignItems="center">
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
          <GenomeSearch
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
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<HighlightIcon />}
              size="small"
              onClick={() => setHighlightDialogOpen(true)}
            >
              View Current Highlights
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
              onClick={() => setShowAddTracksModal(true)}
            >
              Add signal tracks
            </Button>
          </Box>
        </Box>
        <AddTracksModal
          open={showAddTracksModal}
          setOpen={setShowAddTracksModal}
          setSelectedTracks={setSelectedTracks}
          selectedTracks={selectedTracks}
        />
        <Box
          width={"100%"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          display={"flex"}
          alignItems={"center"}
        >
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
            {browserState.domain.chromosome}:{browserState.domain.start.toLocaleString()}-
            {browserState.domain.end.toLocaleString()}
          </h3>

          <svg id="cytobands" width={"700px"} height={20}>
            <GQLCytobands
              assembly="hg38"
              chromosome={browserState.domain.chromosome}
              currentDomain={browserState.domain}
            />
          </svg>
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>hg38</h3>
        </Box>
        <ControlButtons browserState={browserState} browserDispatch={browserDispatch} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 12 }}>
        <GenomeBrowser width={"100%"} browserState={browserState} browserDispatch={browserDispatch} />
      </Grid2>
      <Box
        sx={{
          width: "100%",
          height: 40,
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></Box>
      <HighlightDialog
        open={highlightDialogOpen}
        setOpen={setHighlightDialogOpen}
        highlights={browserState.highlights as GBHighlight[]}
      />
    </Grid2>
  );
}

function defaultTracks(
  geneName: string,
  icreMouseOver: (item: Rect) => void,
  icreMouseOut: () => void,
  onIcreClick: (item: Rect) => void
) {
  const geneTrack = {
    ...DefaultTranscript,
    titleSize: 16,
    id: "default-gene",
    title: "GENCODE genes",
    height: 100,
    color: "#AAAAAA",
    version: TranscriptHumanVersion.V40,
    assembly: "GRCh38",
    queryType: "gene",
    displayMode: DisplayMode.SQUISH,
    geneName: geneName,
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
    displayMode: DisplayMode.FULL,
    id: "all-immune-bigwig",
  };
  return [geneTrack, icreTrack, allImmuneBigWig];
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


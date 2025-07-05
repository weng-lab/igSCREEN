"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Search } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import { Box, Button, IconButton } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import { GQLCytobands } from "@weng-lab/genomebrowser";
import { useRouter } from "next/navigation";
import { GenomeSearch, Result } from "psychscreen-legacy-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenomicElementType, GenomicRange } from "types/globalTypes";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
import AddTracksModal, { BigWig } from "./addTracksModal";
import ControlButtons from "./controls";
import HighlightDialog from "./highlightDialog";
import { randomColor, trackColor } from "./utils";

import {
  BigWigConfig,
  Browser,
  Chromosome,
  DisplayMode,
  Domain,
  InitialBrowserState,
  Track,
  TrackType,
  Transcript,
  useBrowserStore,
  useDataStore,
  useTrackStore,
  Vibrant,
} from "track-logic";

const client = new ApolloClient({
  uri: "https://ga.staging.wenglab.org/graphql",
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

function expandCoordinates(coordinates: GenomicRange) {
  let length = coordinates.end - coordinates.start;
  if (length <= 100) {
    length = 100;
  }
  const padding = Math.floor(length * 0.25);
  return {
    chromosome: coordinates.chromosome as Chromosome,
    start: coordinates.start - padding,
    end: coordinates.end + padding,
  } as Domain;
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
  const addHighlight = useBrowserStore((state) => state.addHighlight);
  const removeHighlight = useBrowserStore((state) => state.removeHighlight);

  const router = useRouter();

  // Bed track mouse over, out, and click handlers
  const onIcreClick = useCallback((item: Rect) => {
    const accession = item.name;
    router.push(`/icre/${accession}`);
  }, []);
  const onGeneClick = useCallback((gene: Transcript) => {
    const name = gene.name;
    if (name.includes("ENSG")) {
      return;
    }
    router.push(`/gene/${name}`);
  }, []);

  const editTrack = useTrackStore((state) => state.editTrack);
  const setDomain = useBrowserStore((state) => state.setDomain);
  const handeSearchSubmit = (r: Result) => {
    if (r.type === "Gene") {
      editTrack("gene-track", {
        geneName: r.title,
      });
    }
    addHighlight({
      domain: r.domain,
      color: randomColor(),
      id: r.title,
    });
    setDomain(expandCoordinates(r.domain));
  };

  const theme = useTheme();

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
            <AddTracks />
          </Box>
        </Box>
        <Box
          width={"100%"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          display={"flex"}
          alignItems={"center"}
        >
          <Info />
        </Box>
        <ControlButtons />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 12 }}>
        <ApolloProvider client={client}>
          <GenomeBrowser
            coordinates={coordinates}
            type={type}
            name={name}
            onGeneClick={onGeneClick}
            onIcreClick={onIcreClick}
          />
        </ApolloProvider>
      </Grid2>
      <Box
        sx={{
          width: "100%",
          height: 40,
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></Box>
    </Grid2>
  );
}

function GenomeBrowser({
  coordinates,
  type,
  name,
  onGeneClick,
  onIcreClick,
}: {
  coordinates: GenomicRange;
  type: GenomicElementType;
  name: string;
  onGeneClick: (gene: Transcript) => void;
  onIcreClick: (item: Rect) => void;
}) {
  const addHighlight = useBrowserStore((state) => state.addHighlight);
  const removeHighlight = useBrowserStore((state) => state.removeHighlight);

  const initialState: InitialBrowserState = {
    domain: expandCoordinates(coordinates),
    marginWidth: 150,
    trackWidth: 1350,
    multiplier: 3,
  };

  const initialTracks: Track[] = useMemo(
    () => [
      {
        id: "gene-track",
        title: "GENCODE genes",
        titleSize: 12,
        height: 50,
        color: "#AAAAAA",
        trackType: TrackType.Transcript,
        assembly: "GRCh38",
        version: 47,
        displayMode: DisplayMode.Squish,
        geneName: type === "gene" ? name : "",
        onHover: (item: Transcript) => {
          addHighlight({
            id: item.name || "dsadsfd",
            domain: { start: item.coordinates.start, end: item.coordinates.end },
            color: item.color || "blue",
          });
        },
        onLeave: (item: Transcript) => {
          removeHighlight(item.name || "dsadsfd");
        },
        onClick: (item: Transcript) => {
          onGeneClick(item);
        },
      },
      {
        id: "ccre-track",
        title: "All Immune cCREs",
        titleSize: 12,
        height: 20,
        color: "#9378bc",
        trackType: TrackType.BigBed,
        displayMode: DisplayMode.Dense,
        url: "http://downloads.wenglab.org/igscreen/iCREs.bigBed",
        onHover: (rect) => {
          addHighlight({
            id: rect.name || "ihqoviun",
            domain: { start: rect.start, end: rect.end },
            color: rect.color || "blue",
          });
        },
        onLeave: (rect) => {
          removeHighlight(rect.name || "ihqoviun");
        },
        onClick: (item: Rect) => {
          onIcreClick(item);
        },
      },
      {
        id: "atac-track",
        title: "ATAC merged signal",
        titleSize: 12,
        height: 100,
        color: "#02c7b9",
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        url: "https://downloads.wenglab.org/igscreen/ATAC_merged_signal.bigWig",
      },
      {
        id: "dnase-track",
        title: "DNAse merged signal",
        titleSize: 12,
        height: 100,
        color: "#06DA93",
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
      },
    ],
    [addHighlight, removeHighlight, onIcreClick, onGeneClick, type, name]
  );
  return <Browser state={initialState} tracks={initialTracks} />;
}

function AddTracks() {
  const [showAddTracksModal, setShowAddTracksModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<BigWig[]>([]);
  const theme = useTheme();

  const currentTracks = useTrackStore((state) => state.tracks);
  const insertTrack = useTrackStore((state) => state.insertTrack);
  const removeTrack = useTrackStore((state) => state.removeTrack);

  useEffect(() => {
    selectedTracks.forEach((track) => {
      // check if the track is not already in the browser state
      if (!currentTracks.some((t) => t.id === track.name + "_temp")) {
        const trackToAdd: BigWigConfig = {
          id: track.name + "_temp",
          title: track.assay + " " + track.displayName,
          url: track.url,
          color: trackColor(track.lineage),
          height: 100,
          titleSize: 16,
          displayMode: DisplayMode.Full,
          trackType: TrackType.BigWig,
        };
        insertTrack(trackToAdd, currentTracks.length);
      }
    });

    // Remove tracks that are no longer selected
    currentTracks.forEach((track) => {
      if (track.id.includes("_temp") && !selectedTracks.some((t) => t.name + "_temp" === track.id)) {
        removeTrack(track.id);
      }
    });
  }, [currentTracks, selectedTracks, insertTrack, removeTrack]);

  return (
    <>
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
      <AddTracksModal
        open={showAddTracksModal}
        setOpen={setShowAddTracksModal}
        setSelectedTracks={setSelectedTracks}
        selectedTracks={selectedTracks}
      />
    </>
  );
}

function HighlightButton() {
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<HighlightIcon />}
        size="small"
        onClick={() => setHighlightDialogOpen(true)}
      >
        View Current Highlights
      </Button>
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} />
    </>
  );
}

function Info() {
  const currentDomain = useBrowserStore((state) => state.domain);

  return (
    <>
      <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
        {currentDomain.chromosome}:{currentDomain.start.toLocaleString()}-{currentDomain.end.toLocaleString()}
      </h3>

      <svg id="cytobands" width={"700px"} height={20}>
        <GQLCytobands assembly="hg38" chromosome={currentDomain.chromosome} currentDomain={currentDomain} />
      </svg>
      <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>hg38</h3>
    </>
  );
}

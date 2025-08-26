import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
  Checkbox,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "app/theme";
import bigwigsData from "./bigwigs.json";
import { assayColor, lineageName, trackColor } from "./utils";

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedTracks: (tracks: BigWig[]) => void;
  selectedTracks: BigWig[];
};

export type BigWig = {
  name: string;
  lineage: string;
  assay: string;
  displayName: string;
  fileID: string;
  url: string;
};

function AddTracksModal({ open, setOpen, setSelectedTracks, selectedTracks }: ModalProps) {
  const [newTracks, setNewTracks] = useState<BigWig[]>(selectedTracks);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, track: BigWig) => {
    if (event.target.checked) {
      setNewTracks([...newTracks, track]);
    } else {
      setNewTracks(newTracks.filter((t) => t.name !== track.name));
    }
  };

  const handleDeselectAll = () => {
    setNewTracks([]);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedTracks([...selectedTracks]);
    setNewTracks([...selectedTracks]);
  };

  const handleAccept = () => {
    if (newTracks.length > 10) {
      alert("You can only display up to 10 tracks at a time");
      return;
    }
    setSelectedTracks([...newTracks]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          backgroundColor: theme.palette.primary.main,
          color: "white",
          width: "900px",
        }}
      >
        <Box display="flex" width="100%" alignItems="center" justifyContent="space-between" gap={1} mb={0}>
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon /> Select signal tracks
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: "white", padding: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContentText sx={{ color: "#cccccc" }}>Select up to 10 DNase and ATAC signal track</DialogContentText>
      </DialogTitle>
      {/* Content */}
      <DialogContent sx={{ width: "100%" }}>
        {Object.entries(bigwigsData).map(([lineage, assays]) => (
          <Accordion
            key={lineage}
            sx={{
              width: "100%",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              mb: 1,
              mt: 1,
              overflow: "hidden",
              "&:before": {
                display: "none",
              },
              "& .MuiAccordionSummary-root": {
                borderLeft: `4px solid ${trackColor(lineage)}`,
                backgroundColor: "#fafafa",
              },
              "& .MuiAccordionDetails-root": {
                borderLeft: `4px solid ${trackColor(lineage)}`,
              },
            }}
            slotProps={{ transition: { unmountOnExit: true } }}
          >
            <AccordionSummary>
              <Box
                width="100%"
                display="flex"
                gap={1}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight="bold" sx={{ color: trackColor(lineage) }}>
                  {lineageName(lineage)}
                </Typography>
                <Typography>
                  {newTracks.filter((t) => t.lineage === lineage).length} /{" "}
                  {assays.dnase.length + assays.atac.length + assays.rna.length}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Accordion
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  mb: 1,
                  "&:before": {
                    display: "none",
                  },
                  "& .MuiAccordionSummary-root": {
                    borderLeft: `3px solid ${assayColor("DNase")}`,
                    backgroundColor: "#f8f8f8",
                  },
                  "& .MuiAccordionDetails-root": {
                    borderLeft: `3px solid ${assayColor("DNase")}`,
                  },
                }}
              >
                <AccordionSummary>
                  <Typography fontWeight="bold">DNase</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TrackCheckboxes tracks={assays.dnase} newTracks={newTracks} handleChange={handleChange} />
                </AccordionDetails>
              </Accordion>
              <Accordion
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  mb: 1,
                  "&:before": {
                    display: "none",
                  },
                  "& .MuiAccordionSummary-root": {
                    borderLeft: `3px solid ${assayColor("ATAC")}`,
                    backgroundColor: "#f8f8f8",
                  },
                  "& .MuiAccordionDetails-root": {
                    borderLeft: `3px solid ${assayColor("ATAC")}`,
                  },
                }}
              >
                <AccordionSummary>
                  <Typography fontWeight="bold">ATAC</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TrackCheckboxes tracks={assays.atac} newTracks={newTracks} handleChange={handleChange} />
                </AccordionDetails>
              </Accordion>
              <Accordion
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  mb: 1,
                  "&:before": {
                    display: "none",
                  },
                  "& .MuiAccordionSummary-root": {
                    borderLeft: `3px solid ${assayColor("RNA")}`,
                    backgroundColor: "#f8f8f8",
                  },
                  "& .MuiAccordionDetails-root": {
                    borderLeft: `3px solid ${assayColor("RNA")}`,
                  },
                }}
              >
                <AccordionSummary>
                  <Typography fontWeight="bold">RNA</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TrackCheckboxes tracks={assays.rna} newTracks={newTracks} handleChange={handleChange} />
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
      {/* Actions */}
      <DialogActions sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="text" color="error" onClick={handleDeselectAll}>
          Clear
        </Button>
        <Box display="flex" gap={1} alignItems="center">
          <Typography fontWeight="bold" color={newTracks.length > 10 ? "error" : "primary"}>
            {newTracks.length} / 10
          </Typography>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAccept}>
            Apply
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function TrackCheckboxes({
  tracks,
  newTracks,
  handleChange,
}: {
  tracks: BigWig[];
  newTracks: BigWig[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, track: BigWig) => void;
}) {
  return (
    <Box width="100%" display="flex" gap={1} flexDirection="column">
      {tracks.length == 0 ? (
        <Typography>No tracks available</Typography>
      ) : (
        tracks.map((track: BigWig) => (
          <Box key={track.name} display="flex" gap={1} alignItems="center">
            <Checkbox
              checked={newTracks.some((t) => t.name === track.name)}
              onChange={(event) => handleChange(event, track)}
            />
            {track.displayName}
          </Box>
        ))
      )}
    </Box>
  );
}

export default AddTracksModal;

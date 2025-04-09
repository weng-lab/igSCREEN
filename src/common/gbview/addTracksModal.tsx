import { useEffect, useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "app/theme";
import bigwigsData from "./bigwigs.json";

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
    setSelectedTracks([...newTracks]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          backgroundColor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={0}>
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon /> Select signal tracks
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: "white", padding: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContentText sx={{ color: "#cccccc" }}>Select tracks you wish to display</DialogContentText>
      </DialogTitle>
      <DialogContent>
        {Object.entries(bigwigsData).map(([lineage, assays]) => (
          <Box
            display="flex"
            marginBlock={0.5}
            flexDirection="row"
            justifyContent="space-between"
            alignItems={"center"}
            key={lineage}
            width={500}
          >
            <Accordion sx={{ width: "100%" }} slotProps={{transition: {unmountOnExit: true}}}>
              <AccordionSummary>
                <Box width="100%" display="flex" gap={1} flexDirection="row" justifyContent="center" alignItems="center">
                  <Typography>{lineage} tracks</Typography>
                </Box>
              </AccordionSummary>
              <Box display="flex" gap={1} flexDirection="column" justifyContent="space-between">
                <Box display="flex" gap={4} justifyContent="space-around" width="100%">
                  <Typography>DNAse</Typography>
                  <Typography>ATAC</Typography>
                </Box>
                <Box display="flex" gap={1} flexDirection="row" justifyContent="space-evenly" paddingInline={1}>
                  <Box width="45%" display="flex" gap={1} flexDirection="column">
                    {assays.dnase.length == 0 ? (
                      <Typography>No DNAse tracks available</Typography>
                    ) : (
                      assays.dnase.map((track: BigWig) => (
                        <Box key={track.name} display="flex" gap={1} alignItems="center">
                          <Checkbox
                            checked={newTracks.some((t) => t.name === track.name)}
                            onChange={(event) => handleChange(event, track)}
                          />
                          {track.name}
                        </Box>
                      ))
                    )}
                  </Box>
                  <Box width="50%" display="flex" gap={1} flexDirection="column">
                    {assays.atac.length == 0 ? (
                      <Typography>No ATAC tracks available</Typography>
                    ) : (
                      assays.atac.map((track: BigWig) => (
                        <Box key={track.name} display="flex" gap={1} alignItems="center">
                          <Checkbox
                            checked={newTracks.some((t) => t.name === track.name)}
                            onChange={(event) => handleChange(event, track)}
                          />
                          {track.name}
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
            </Accordion>
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={handleDeselectAll}>Clear</Button>
        <Box display="flex" gap={1}>
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

export default AddTracksModal;

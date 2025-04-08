import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { BigWigTrackProps } from "@weng-lab/genomebrowser";
import { atacTracks, dnaseTracks } from "./tracks";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "app/theme";

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedTracks: (tracks: BigWigTrackProps[]) => void;
  selectedTracks: BigWigTrackProps[];
};

function AddTracksModal({ open, setOpen, setSelectedTracks, selectedTracks }: ModalProps) {
  const tracks = atacTracks.concat(dnaseTracks);
  const [newTracks, setNewTracks] = useState<BigWigTrackProps[]>(selectedTracks);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const track = tracks.find((t) => t.id === event.target.name);
    if (!track) return;

    if (event.target.checked) {
      setNewTracks([...newTracks, track]);
    } else {
      setNewTracks(newTracks.filter((t) => t.id !== track.id));
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

  const trackGroups = ["B Cells", "CD4 T Cells", "Erythroblasts", "Myeloid", "NK", "Progenitors", "GD T Cells"];

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
        {trackGroups.map((group, index) => {
          let dnaseTrack = dnaseTracks[index];
          let atacTrack = atacTracks[index];
          return (
            <Box display="flex" flexDirection="row" gap={1} justifyContent="space-between" alignItems="center" key={index}>
              <Typography variant="h6">{group}</Typography>
              <Box display="flex" flexDirection="row" gap={1}>
                <Checkbox checked={newTracks.includes(dnaseTrack)} onChange={handleChange} name={dnaseTrack.id} />
                <Checkbox checked={newTracks.includes(atacTrack)} onChange={handleChange} name={atacTrack.id} />
              </Box>
            </Box>
          );
        })}
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

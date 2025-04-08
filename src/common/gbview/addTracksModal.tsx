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
import { atacTracks, dnaseTracks } from "./consts";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';
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
        <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography mt={1} variant="h5">
              ATAC-seq
            </Typography>
            {atacTracks.map((track, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox checked={newTracks.includes(track)} onChange={handleChange} name={track.id} />}
                label={track.title.replace("ATAC ", "")}
              />
            ))}
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography mt={1} variant="h5">
              DNase-seq
            </Typography>
            {dnaseTracks.map((track, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox checked={newTracks.includes(track)} onChange={handleChange} name={track.id} />}
                label={track.title.replace("DNase ", "")}
              />
            ))}
          </Box>
        </FormGroup>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={handleDeselectAll}>Clear</Button>
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleAccept}>Apply</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AddTracksModal;

import React, { useCallback, useState } from "react";
import { Modal, Accordion, Box } from "@mui/material";
import { Typography, Button } from "@weng-lab/psychscreen-ui-components";
import { CalderonBigWigTracks } from "../consts";
import {
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type ChromBPNetAtacModalProps = {
  open?: boolean;
  onAccept?: (tracks: [string, string][]) => void;
  onCancel?: () => void;
  initialSelection: [string, string][];
};

const style = {
  position: "absolute" as "absolute",
  top: "25%",
  left: "50%",
  transform: "translate(-50%, -15%)",
  width: "50%",
  bgcolor: "background.paper",
  backgroundColor: "#ffffff",
  border: "2px solid #000",
  p: 4,
  padding: "2em",
  borderRadius: "20px",
};


let calderonexpTracks = CalderonBigWigTracks.map(c=>{
  return [
    c[2],`https://downloads.wenglab.org/chrombpnetbulkatac/${c[0]}.bigWig`
  ]
})


const TRACKS = {    
  "ChromBPNet Atac Tracks": calderonexpTracks
};

const ChromBPNetAtacModal: React.FC<ChromBPNetAtacModalProps> = (props) => {
  const [expanded, setExpanded] = useState(
    new Map(Object.keys(TRACKS).map((k) => [k, false]))
  );
  const [selectedTracks, setSelectedTracks] = useState(
    props.initialSelection.map((x) => x[0])
  );
  const toggleTrack = useCallback(
    (track: string[]) => {
      const selected = !!selectedTracks.find((x) => x === track[0])?.length;
      if (!selected) setSelectedTracks([...selectedTracks, track[0]]);
      else setSelectedTracks(selectedTracks.filter((x) => x !== track[0]));
    },
    [selectedTracks]
  );
  const expand = useCallback(
    (key: string) =>
      setExpanded(
        new Map(
          Object.keys(TRACKS).map((k) => [
            k,
            k === key ? !expanded.get(k) : !!expanded.get(k),
          ])
        )
      ),
    [expanded]
  );

  const onAccept = useCallback(
    () =>
      props.onAccept &&
      props.onAccept([
        ...TRACKS["ChromBPNet Atac Tracks"].filter(
          (track) =>
            (selectedTracks.find((x) => x === track[0])?.length || 0) > 0
        )
    
      ] as [string, string][]),
    [selectedTracks, props]
  );

  return (
    <Modal
      open={!!props.open}
      onClose={props.onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} style={style}>
        <Typography
          type="headline"
          size="medium"
          style={{ marginBottom: "0.6em" }}
        >
          Select ChromBPNet Atac Tracks for Display
        </Typography>
        <Accordion expanded={expanded.get("ChromBPNet Atac Tracks")}>
          <AccordionSummary
            onClick={() => expand("ChromBPNet Atac Tracks")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
            ChromBPNet Atac Tracks
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
          <Paper
                    elevation={0}
                    style={{ maxHeight: 500,  overflow: "auto" }}
                  >
            <FormGroup style={{ marginLeft: "3em" }}>
           
              {TRACKS["ChromBPNet Atac Tracks"].map((track) => (
                <FormControlLabel
                  key={track[0]}
                  control={
                    <Checkbox
                      checked={
                        (selectedTracks.find((x) => x === track[0])?.length ||
                          0) > 0
                      }
                    />
                  }
                  label={track[0]}
                  onChange={() => toggleTrack(track)}
                />
              ))}
              
            </FormGroup>
            </Paper>
          </AccordionDetails>
        </Accordion>
        <div style={{ marginTop: "1em", width: "100%", textAlign: "right" }}>
          <Button bvariant="outlined" btheme="light" onClick={onAccept}>
            OK
          </Button>
          &nbsp;
          <Button
            bvariant="outlined"
            btheme="light"
            onClick={() => {
              props.onCancel && props.onCancel();
              setSelectedTracks(props.initialSelection.map((x) => x[0]));
            }}
          >
            cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
export default ChromBPNetAtacModal;

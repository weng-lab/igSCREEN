import React, { useCallback, useMemo, useState } from "react";
import { Modal, Accordion, Box } from "@mui/material";
import { Typography, Button } from "@weng-lab/psychscreen-ui-components";
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
import { cellTypeStaticInfo } from "../consts";
import { CellTypeStaticInfo } from "../../app/celllineage/types";
import { extractQueryValues, getCellDisplayName } from "../../app/celllineage/utils";

type BulkAtacTrackModalTrackModalProps = {
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

//This needs to be commented, I'm having a lot of trouble figuring out why this is so complicated? Why is expanded a map function not a boolean?
const BulkAtacTrackModal: React.FC<BulkAtacTrackModalTrackModalProps> = (props) => {
  const TRACKS = useMemo(() => {
    const x = { "Bulk Atac Tracks": [] };
    Object.values(cellTypeStaticInfo).forEach((cell: CellTypeStaticInfo) => {
      const queryVals = extractQueryValues(cell, "B")
      queryVals.forEach(queryVal => {
        x["Bulk Atac Tracks"].push(
          [
            getCellDisplayName(queryVal, true, true) + `(${queryVal})`,
            `https://downloads.wenglab.org/${queryVal}.bigWig`
          ]
        )
      })
    })
    return x
  }, [cellTypeStaticInfo])
  
  const [expanded, setExpanded] = useState(new Map(Object.keys(TRACKS).map((k) => [k, false])));
  const [selectedTracks, setSelectedTracks] = useState(props.initialSelection.map((x) => x[0]));
 
  
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
    [expanded]);

  const onAccept = useCallback(
    () =>
      props.onAccept &&
      props.onAccept([
        ...TRACKS["Bulk Atac Tracks"].filter(
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
          Select Bulk Atac Tracks for Display
        </Typography>
        <Accordion expanded={expanded.get("Bulk Atac Tracks")}>
          <AccordionSummary
            onClick={() => expand("Bulk Atac Tracks")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
              Bulk Atac Tracks
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              elevation={0}
              style={{ maxHeight: 500, overflow: "auto" }}
            >
              <FormGroup style={{ marginLeft: "3em" }}>
                {TRACKS["Bulk Atac Tracks"].map((track) => (
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
export default BulkAtacTrackModal;

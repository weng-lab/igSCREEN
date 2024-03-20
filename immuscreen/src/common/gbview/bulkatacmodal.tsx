import React, { useCallback, useState } from "react";
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

const TRACKS = {
    
  "Bulk Atac Tracks": [
      [
        "Bulk B Stimulated",
        "https://downloads.wenglab.org/Bulk_B-S.bigWig",
      ],
      [
        "Bulk B Untimulated",
        "https://downloads.wenglab.org/Bulk_B-U.bigWig",
      ],
      [
        "CD8pos T Stimulated",
        "https://downloads.wenglab.org/CD8pos_T-S.bigWig",
      ],
      [
        "CD8pos T Unstimulated",
        "https://downloads.wenglab.org/CD8pos_T-U.bigWig",
      ],
      [
        "Central memory CD8pos T Stimulated",
        "https://downloads.wenglab.org/Central_memory_CD8pos_T-S.bigWig"
      ],
      [
        "Central memory CD8pos T Unstimulated",
        "https://downloads.wenglab.org/Central_memory_CD8pos_T-U.bigWig"
      ],[
        "Effector CD4pos T Stimulated",
        "https://downloads.wenglab.org/Effector_CD4pos_T-S.bigWig"
      ],
      [
        "Effector CD4pos T Unstimulated",
        "https://downloads.wenglab.org/Effector_CD4pos_T-U.bigWig"
      ],
      [
        "Effector memory CD8pos T Stimulated",
        "https://downloads.wenglab.org/Effector_memory_CD8pos_T-S.bigWig"
      ],
      [
        "Effector memory CD8pos T Unstimulated",
        "https://downloads.wenglab.org/Effector_memory_CD8pos_T-U.bigWig"
      ],
      [
        "Follicular T Helper Stimulated",
        "https://downloads.wenglab.org/Follicular_T_Helper-S.bigWig"
      ],
      [
        "Follicular T Helper Unstimulated",
        "https://downloads.wenglab.org/Follicular_T_Helper-U.bigWig"
      ],
      [
        "Gamma delta T Stimulated",
        "https://downloads.wenglab.org/Gamma_delta_T-S.bigWig"
      ],
      [
        "Gamma delta T Unstimulated",
        "https://downloads.wenglab.org/Gamma_delta_T-U.bigWig"
      ],
      [
        "Immature NK Unstimulated",
        "https://downloads.wenglab.org/Immature_NK-U.bigWig"
      ],
      [
        "Mature NK Unstimulated",
        "https://downloads.wenglab.org/Mature_NK-U.bigWig"
      ],
      [
        "Mem B Stimulated",
        "https://downloads.wenglab.org/Mem_B-S.bigWig"
      ],
      [
        "Mem B Unstimulated",
        "https://downloads.wenglab.org/Mem_B-U.bigWig"
      ],
      [
        "Memory Teffs Stimulated",
        "https://downloads.wenglab.org/Memory_Teffs-S.bigWig"
        ],
    [
            "Memory Teffs Unstimulated",
            "https://downloads.wenglab.org/Memory_Teffs-U.bigWig"
    ],
    [
        "Memory Tregs Stimulated",
        "https://downloads.wenglab.org/Memory_Tregs-S.bigWig"
    ],
    [
        "Memory Tregs Unstimulated",
        "https://downloads.wenglab.org/Memory_Tregs-U.bigWig"

    ],
    [
        "Monocytes Unstimulated",
        "https://downloads.wenglab.org/Monocytes-U.bigWig"
    ],
    [
        "Myeloid DCs Unstimulated",
        "https://downloads.wenglab.org/Myeloid_DCs-U.bigWig"
    ],
    [
        "Naive B Stimulated",
        "https://downloads.wenglab.org/Naive_B-S.bigWig"
    ],
    [
        "Naive B Unstimulated",
        "https://downloads.wenglab.org/Naive_B-U.bigWig"
    ],
    [
        "Naive CD8 T Stimulated",
        "https://downloads.wenglab.org/Naive_CD8_T-S.bigWig"
    ],
    [
        "Naive CD8 T Unstimulated",

        "https://downloads.wenglab.org/Naive_CD8_T-U.bigWig"
    ],
    [
        "Naive Teffs Stimulated",
        "https://downloads.wenglab.org/Naive_Teffs-S.bigWig"
    ],
    [
        "Naive Teffs Unstimulated",
        "https://downloads.wenglab.org/Naive_Teffs-U.bigWig"
    ],
    [
        "Naive Tregs Stimulated",
        "https://downloads.wenglab.org/Naive_Tregs-S.bigWig"
    ],
    [
        "Naive Tregs Unstimulated",
        "https://downloads.wenglab.org/Naive_Tregs-U.bigWig"
    ],
    [
        "pDCs Unstimulated",
        "https://downloads.wenglab.org/pDCs-U.bigWig"

    ],
    [
        "Plasmablasts Unstimulated",
        "https://downloads.wenglab.org/Plasmablasts-U.bigWig"
    ],
    [
        "Regulatory T Stimulated",
        "https://downloads.wenglab.org/Regulatory_T-S.bigWig"
    ],
    [
        "Regulatory T Unstimulated",
        "https://downloads.wenglab.org/Regulatory_T-U.bigWig"
    ],
    [
        "Th17 precursors Stimulated",
        "https://downloads.wenglab.org/Th17_precursors-S.bigWig"
    ],
    [
        "Th17 precursors Unstimulated",
        "https://downloads.wenglab.org/Th17_precursors-U.bigWig"
    ],
    [
        "Th1 precursors Stimulated",
        "https://downloads.wenglab.org/Th1_precursors-S.bigWig"
    ],
    [
        "Th1 precursors Unstimulated",
        "https://downloads.wenglab.org/Th1_precursors-U.bigWig"
    ],
    [
        "Th2 precursors Stimulated",
        "https://downloads.wenglab.org/Th2_precursors-S.bigWig"
    ],
    [
        "Th2 precursors Unstimulated",
        "https://downloads.wenglab.org/Th2_precursors-U.bigWig"
    ]
  ]
};

const BulkAtacTrackModal: React.FC<BulkAtacTrackModalTrackModalProps> = (props) => {
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
                    style={{ maxHeight: 500,  overflow: "auto" }}
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

'use client'
import * as React from "react"
import CellTypeTree from "../../common/components/cellTypeTree"
import { useCallback, useEffect, useMemo, useState } from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { gql, useLazyQuery } from "@apollo/client";
import { client } from "../../common/utils";
import UpSetPlot from "./UpSetPlot";
import { v4 as uuidv4 } from 'uuid'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import FlashOffOutlinedIcon from '@mui/icons-material/FlashOffOutlined';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import LoadingButton from '@mui/lab/LoadingButton';

//Info for each cell type
export interface CellTypeInfo {
  readonly id: string; // used to set state of correct celltype afer its content is spread (...) into tree data and stripped of key name. Needs to match key exactly
  readonly displayName: string;
  readonly unstimImagePath: string;
  readonly stimImagePath?: string;
  selected: boolean;
  stimulated: "S" | "U" | "B";
  readonly selectable: boolean;
  readonly stimulable: boolean;
  readonly queryValues?: {
    readonly unstimulated: { Calderon?: string | string[], Corces?: string | string[] };
    readonly stimulated?: { Calderon: string | string[] }
  }
  //Counts are currently hardcoded below.
  readonly unstimCount: number
  readonly stimCount?: number
}

export interface CellTypes {
  Myeloid_DCs: CellTypeInfo,
  pDCs: CellTypeInfo,
  Naive_B: CellTypeInfo,
  Mem_B: CellTypeInfo,
  Plasmablasts: CellTypeInfo,
  Regulatory_T: CellTypeInfo,
  Naive_Tregs: CellTypeInfo,
  Memory_Tregs: CellTypeInfo,
  Effector_CD4pos_T: CellTypeInfo,
  Naive_Teffs: CellTypeInfo,
  Memory_Teffs: CellTypeInfo,
  Th1_precursors: CellTypeInfo,
  Th2_precursors: CellTypeInfo,
  Th17_precursors: CellTypeInfo,
  Follicular_T_Helper: CellTypeInfo,
  Naive_CD8_T: CellTypeInfo,
  Central_memory_CD8pos_T: CellTypeInfo,
  Effector_memory_CD8pos_T: CellTypeInfo,
  Gamma_delta_T: CellTypeInfo,
  Immature_NK: CellTypeInfo,
  Mature_NK: CellTypeInfo,
  Memory_NK: CellTypeInfo,
  HSC: CellTypeInfo, //Hematopoetic Stem Cell
  MPP: CellTypeInfo, //Multipotent Progenitor
  CMP: CellTypeInfo, //Common Myeloid Progenitor
  MEP: CellTypeInfo, //Megakaryocyte Erythroid Progenitor
  Ery: CellTypeInfo, //Erythrocyte
  GMP: CellTypeInfo, //Granulocyte-Monocyte Progenitors
  LPMP: CellTypeInfo, //Lymphocyte-Primed Multipotent Progenitor
  CLP: CellTypeInfo, //Common Lymphoid Progenitor
  CD4Tcell: CellTypeInfo, //CD4+ Tcell
  Nkcell: CellTypeInfo, //NK cell
  //These are the cells which have data from both Calderon and Corces
  Monocytes: CellTypeInfo, //Using Calderon "name". Using Calderon's Stimulated/Unstimulated. In Corces it is "Mono", and no stimulation info
  Bulk_B: CellTypeInfo, //Using Calderon "name". Using Calderon's Stimulated/Unstimulated. In Corces it is "Bcell", and no stimulation info
  CD8pos_T: CellTypeInfo, //Using Calderon "name". Using Calderon's Stimulated/Unstimulated. In Corces it is "CD8Tcell", and no stimulation info
}

type QueryGroup = {
  intersect?: string[][],
  exclude?: string[][],
  union?: string[],
  name: string
}

export type CCRE_CLASS = "CA-CTCF" | "CA-TF" | "CA-H3K4me3" | "TF" | "CA" | "pELS" | "dELS" | "PLS"

const classDisplaynames: { [key in CCRE_CLASS]: string } = {
  "CA-CTCF": "Chromatin Accessible with CTCF",
  "CA-TF": "Chromatin Accessible with TF",
  "CA-H3K4me3": "Chromatin Accessible with H3K4me3",
  "TF": "TF",
  "CA": "Chromatin Accessible Only",
  "pELS": "Proximal Enhancer-Like Signature",
  "dELS": "Distal Enhancer-Like Signature",
  "PLS": "Promoter-Like Signature"
}



/**
 * Initial configuration of the cell type tree
 * To break displayName into multiple lines in the tree, use '/' instead of a space
 */
const cellTypeInitialState: CellTypes = {
  Monocytes: {
    id: 'Monocytes',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Monocyte",
    unstimImagePath: '/cellTypes/Monocytes-U.png',
    stimImagePath: '/cellTypes/Monocytes-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Monocytes-U', Corces: 'Mono' },
      stimulated: { Calderon: 'Monocytes-S' }
    },
    unstimCount: 130780,
    stimCount: 100461
  },
  Myeloid_DCs: {
    id: 'Myeloid_DCs',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Myeloid/dendritic cell",
    unstimImagePath: '/cellTypes/Myeloid_DCs-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: "Myeloid_DCs-U" }
    },
    unstimCount: 173394
  },
  pDCs: {
    id: 'pDCs',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Plasmacytoid/dendritic cell",
    unstimImagePath: '/cellTypes/pDCs-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'pDCs-U' }
    },
    unstimCount: 146515
  },
  Bulk_B: {
    id: 'Bulk_B',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Bulk/B cell",
    unstimImagePath: '/cellTypes/Bulk_B-U.png',
    stimImagePath: '/cellTypes/Bulk_B-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Bulk_B-U', Corces: "Bcell" },
      stimulated: { Calderon: 'Bulk_B-S' }
    },
    unstimCount: 138138,
    stimCount: 124969
  },
  Naive_B: {
    id: 'Naive_B',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Naïve/B cell",
    unstimImagePath: '/cellTypes/Naive_B-U.png',
    stimImagePath: '/cellTypes/Naive_B-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_B-U' },
      stimulated: { Calderon: 'Naive_B-S' }
    },
    unstimCount: 120624,
    stimCount: 128979
  },
  Mem_B: {
    id: 'Mem_B',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Memory/B cell",
    unstimImagePath: '/cellTypes/Mem_B-U.png',
    stimImagePath: '/cellTypes/Mem_B-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Mem_B-U' },
      stimulated: { Calderon: 'Mem_B-S' }
    },
    unstimCount: 122662,
    stimCount: 129491
  },
  Plasmablasts: {
    id: 'Plasmablasts',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Plasmablast",
    unstimImagePath: '/cellTypes/Plasmablasts-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'Plasmablasts-U' }
    },
    unstimCount: 123042
  },
  Regulatory_T: {
    id: 'Regulatory_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Regulatory/CD4+ T cell",
    unstimImagePath: '/cellTypes/Regulatory_T-U.png',
    stimImagePath: '/cellTypes/Regulatory_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Regulatory_T-U' },
      stimulated: { Calderon: 'Regulatory_T-S' }
    },
    unstimCount: 124481,
    stimCount: 126696
  },
  Naive_Tregs: {
    id: 'Naive_Tregs',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Naïve T/regulatory cell",
    unstimImagePath: '/cellTypes/Naive_Tregs-U.png',
    stimImagePath: '/cellTypes/Naive_Tregs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_Tregs-U' },
      stimulated: { Calderon: 'Naive_Tregs-S' }
    },
    unstimCount: 95731,
    stimCount: 100068
  },
  Memory_Tregs: {
    id: 'Memory_Tregs',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Memory T/regulatory cell",
    unstimImagePath: '/cellTypes/Memory_Tregs-U.png',
    stimImagePath: '/cellTypes/Memory_Tregs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Memory_Tregs-U' },
      stimulated: { Calderon: 'Memory_Tregs-S' }
    },
    unstimCount: 125459,
    stimCount: 121029
  },
  Effector_CD4pos_T: {
    id: 'Effector_CD4pos_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Effector/CD4+ T cell",
    unstimImagePath: '/cellTypes/Effector_CD4pos_T-U.png',
    stimImagePath: '/cellTypes/Effector_CD4pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Effector_CD4pos_T-U' },
      stimulated: { Calderon: 'Effector_CD4pos_T-S' }
    },
    unstimCount: 123382,
    stimCount: 137982
  },
  Naive_Teffs: {
    id: 'Naive_Teffs',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Naïve T/effector cell",
    unstimImagePath: '/cellTypes/Naive_Teffs-U.png',
    stimImagePath: '/cellTypes/Naive_Teffs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_Teffs-U' },
      stimulated: { Calderon: 'Naive_Teffs-S' }
    },
    unstimCount: 117212,
    stimCount: 137523
  },
  Memory_Teffs: {
    id: 'Memory_Teffs',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Memory T/effector cell",
    unstimImagePath: '/cellTypes/Memory_Teffs-U.png',
    stimImagePath: '/cellTypes/Memory_Teffs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Memory_Teffs-U' },
      stimulated: { Calderon: 'Memory_Teffs-S' }
    },
    unstimCount: 137523,
    stimCount: 148833
  },
  Th1_precursors: {
    id: 'Th1_precursors',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Th1/precursor",
    unstimImagePath: '/cellTypes/Th1_precursors-U.png',
    stimImagePath: '/cellTypes/Th1_precursors-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Th1_precursors-U' },
      stimulated: { Calderon: 'Th1_precursors-S' }
    },
    unstimCount: 121879,
    stimCount: 145297
  },
  Th2_precursors: {
    id: 'Th2_precursors',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Th2/precursor",
    unstimImagePath: '/cellTypes/Th2_precursors-U.png',
    stimImagePath: '/cellTypes/Th2_precursors-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Th2_precursors-U' },
      stimulated: { Calderon: 'Th2_precursors-S' }
    },
    unstimCount: 122826,
    stimCount: 141664
  },
  Th17_precursors: {
    id: 'Th17_precursors',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Th17/precursor",
    unstimImagePath: '/cellTypes/Th17_precursors-U.png',
    stimImagePath: '/cellTypes/Th17_precursors-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Th17_precursors-U' },
      stimulated: { Calderon: 'Th17_precursors-S' }
    },
    unstimCount: 128606,
    stimCount: 147883
  },
  Follicular_T_Helper: {
    id: 'Follicular_T_Helper',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "T follicular/helper cell",
    unstimImagePath: '/cellTypes/Follicular_T_helper-U.png',
    stimImagePath: '/cellTypes/Follicular_T_helper-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Follicular_T_Helper-U' },
      stimulated: { Calderon: 'Follicular_T_Helper-S' }
    },
    unstimCount: 122084,
    stimCount: 136992
  },
  CD8pos_T: {
    id: 'CD8pos_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "CD8+ T cell",
    unstimImagePath: '/cellTypes/CD8pos_T-U.png',
    stimImagePath: '/cellTypes/CD8pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'CD8pos_T-U', Corces: "CD8Tcell" },
      stimulated: { Calderon: 'CD8pos_T-S' }
    },
    unstimCount: 151004,
    stimCount: 127042
  },
  Naive_CD8_T: {
    id: 'Naive_CD8_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Naïve CD8+/T cell",
    unstimImagePath: '/cellTypes/Naive_CD8_T-U.png',
    stimImagePath: '/cellTypes/Naive_CD8_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_CD8_T-U' },
      stimulated: { Calderon: 'Naive_CD8_T-S' }
    },
    unstimCount: 100250,
    stimCount: 113028
  },
  Central_memory_CD8pos_T: {
    id: 'Central_memory_CD8pos_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Central/memory/CD8+ T cell",
    unstimImagePath: '/cellTypes/Central_memory_CD8pos_T-U.png',
    stimImagePath: '/cellTypes/Central_memory_CD8pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Central_memory_CD8pos_T-U' },
      stimulated: { Calderon: 'Central_memory_CD8pos_T-S' }
    },
    unstimCount: 125778,
    stimCount: 136023
  },
  Effector_memory_CD8pos_T: {
    id: 'Effector_memory_CD8pos_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Effector/memory/CD8+ T cell",
    unstimImagePath: '/cellTypes/Effector_Memory_CD8pos_T-U.png',
    stimImagePath: '/cellTypes/Effector_memory_CD8pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Effector_memory_CD8pos_T-U' },
      stimulated: { Calderon: 'Effector_memory_CD8pos_T-S' }
    },
    unstimCount: 145641,
    stimCount: 132761
  },
  Gamma_delta_T: {
    id: 'Gamma_delta_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Gamma-delta/T cell",
    unstimImagePath: '/cellTypes/Gamma_delta_T-U.png',
    stimImagePath: '/cellTypes/Gamma_delta_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Gamma_delta_T-U' },
      stimulated: { Calderon: 'Gamma_delta_T-S' }
    },
    unstimCount: 133605,
    stimCount: 116220
  },
  Immature_NK: {
    id: 'Immature_NK',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Immature/NK cell",
    unstimImagePath: '/cellTypes/Immature_NK-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'Immature_NK-U' }
    },
    unstimCount: 130554
  },
  Mature_NK: {
    id: 'Mature_NK',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Mature/NK cell",
    unstimImagePath: '/cellTypes/Mature_NK-U.png',
    stimImagePath: '/cellTypes/Mature_NK-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Mature_NK-U' },
      stimulated: { Calderon: 'Mature_NK-S' }
    },
    unstimCount: 119958,
    stimCount: 110082
  },
  Memory_NK: {
    id: 'Memory_NK',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Memory/NK cell",
    unstimImagePath: '/cellTypes/Memory_NK-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'Memory_NK-U' }
    },
    unstimCount: 135352
  },
  HSC: {
    id: 'HSC',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Hematopoetic/stem cell",
    unstimImagePath: '/cellTypes/HSC.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: ["HSC", "CD34_Cord_Blood", "CD34_Bone_Marrow"] }
    },
    unstimCount: 173583
  },
  MPP: {
    id: "MPP",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Multipotent/progenitor",
    unstimImagePath: '/cellTypes/MPP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "MPP" }
    },
    unstimCount: 158945
  },
  CMP: {
    id: "CMP",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Common myeloid/progenitor",
    unstimImagePath: '/cellTypes/CMP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "CMP" }
    },
    unstimCount: 159706
  },
  MEP: {
    id: "MEP",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Megakaryocyte-erythroid/progenitor",
    unstimImagePath: '/cellTypes/MEP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "MEP" }
    },
    unstimCount: 152044
  },
  Ery: {
    id: "Ery",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Erythrocyte",
    unstimImagePath: '/cellTypes/Erythrocyte.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "Ery" }
    },
    unstimCount: 56267
  },
  GMP: {
    id: "GMP",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Granulocyte-monocyte/progenitors",
    unstimImagePath: '/cellTypes/GMP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "GMP" }
    },
    unstimCount: 158558
  },
  LPMP: {
    id: "LPMP",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Lymphocyte-primed/multipotent progenitor",
    unstimImagePath: '/cellTypes/LMP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "LMPP" }
    },
    unstimCount: 128494
  },
  CLP: {
    id: "CLP",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Common lymphoid/progenitor",
    unstimImagePath: '/cellTypes/CLP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "CLP" }
    },
    unstimCount: 93170
  },
  CD4Tcell: {
    id: "CD4Tcell",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "CD4+ T cell",
    unstimImagePath: '/cellTypes/CD4posT.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "CD4Tcell" }
    },
    unstimCount: 121034
  },
  Nkcell: {
    id: "Nkcell",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "NK cell",
    unstimImagePath: '/cellTypes/Nkcell.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "NKcell" }
    },
    unstimCount: 116626
  }
}

export default function UpSet() {
  const [cellTypeState, setCellTypeState] = useState<CellTypes>(cellTypeInitialState) //state of tree
  const [stimulateMode, setStimulateMode] = useState<boolean>(false) //determines whether a click on the tree selects or stimulates cell
  const [cursor, setCursor] = useState<'auto' | 'pointer' | 'cell' | 'not-allowed'>('auto') //cursor changes with stimulateMode and hovering
  //Modifications to tree and checkboxes wipe needed info for download, so store when generating:
  const [upSetCells, setUpSetCells] = useState<CellTypeInfo[]>([]) //stores array of selected cells when generating
  const [upSetClasses, setUpSetClasses] = useState<CCRE_CLASS[]>(null) //stores array of selected classes when generating
  const [upSetQueryGroups, setUpSetQueryGroups] = useState<{ [key: string]: QueryGroup }>(null) //stores groupings used to generate query (for DL)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [checkboxClasses, setCheckboxClasses] = useState<{ [key in CCRE_CLASS]: boolean }>({
    "CA-CTCF": true,
    "CA-TF": true,
    "CA-H3K4me3": true,
    "TF": true,
    "CA": true,
    "pELS": true,
    "dELS": true,
    "PLS": true
  })
  const [openSnackbar, setOpenSnackbar] = useState(false) //Snackbar is the popup alert component
  const [snackbarMessage, setSnackbarMessage] = useState(null)


  /**
   * Opens the snackbar (alert) with the passed message
   * @param message message to display on snackbar
   */
  const handleOpenSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setOpenSnackbar(true);
  };


  /**
   * Closes the Snackbar (alert)
   * @param event 
   * @param reason 
   */
  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  /**
   * Applies the given stimulation status to all cells (If it doesn't exceed selection limit)
   * @param mode "U" | "S" | "B" the stimulation mode to apply to all cells
   */
  const handleStimulateAll = (mode: "U" | "S" | "B") => {
    const currentlySelected = Object.values(cellTypeState)
      .filter((x: CellTypeInfo) => x.selected)
      .reduce((accumulator, current: CellTypeInfo) => current.stimulated === "B" ? accumulator + 2 : accumulator + 1, 0)
    //If applying "B" stimulation status would exceed selection limit, stop and send alert to user.
    if (mode === "B" && (currentlySelected * 2) > cellTreeSelectionLimit) {
      handleOpenSnackbar("Unable to apply \"Both\" stimulation status due to selection limit (6)")
    } else {
      let newObj = { ...cellTypeState }
      for (let cellName in newObj) {
        newObj[cellName].stimulable && (newObj[cellName].stimulated = mode)
      }
      setCellTypeState(newObj)
    }
  }

  /**
   * Unselects all cells
   */
  const handleUnselectAll = () => {
    let newObj = { ...cellTypeState }
    for (let cellName in newObj) {
      newObj[cellName].selectable && (newObj[cellName].selected = false)
    }
    setCellTypeState(newObj)
  }

  /**
   * Toggles stimulation mode between true/false and sets the cursor to needed value
   */
  const handleToggleStimulateMode = () => {
    setStimulateMode(!stimulateMode)
    setCursor(!stimulateMode ? 'cell' : 'auto')
  }

  const GET_ICRE_FILE = gql`
    query getFile(
      $celltypes: [[String]]
      $excludecelltypes: [[String]]
      $uuid: String!
      $group: [String!]
    ) {
      createicresFilesQuery(
        uuid: $uuid
        celltypes: $celltypes
        excludecelltypes: $excludecelltypes
        group: $group
      )
    }
  `
  //Query for downloading set of iCREs. Fetches URL that is downloaded from
  const [getiCREFileURL, { data: data_download_url, loading: loading_download_url, error: error_download_url }] = useLazyQuery(GET_ICRE_FILE, { client })
  

  /**
   * Downloads the set of iCREs with the passed downloadKey. 
   * Download key is used to select a given QueryGroup from the upSetQueryGroups object state variable.
   * The key is either "Union_All", a cell name, or a combination of 1's and 0's for an intersection.
   * @param downloadKey 
   */
  const handleUpsetDownload = useCallback(async (downloadKey: string) => {
    try {
      setDownloading(true)
      const cellGroupings: QueryGroup = upSetQueryGroups[downloadKey]
      const res = await getiCREFileURL({
        variables: {
          uuid: uuidv4(),
          celltypes: cellGroupings?.union ? [[...cellGroupings.union]] : cellGroupings.intersect,
          excludecelltypes: cellGroupings?.exclude?.length > 0 ? cellGroupings.exclude : undefined,
          group: upSetClasses
        }
      })
      fetch(res.data.createicresFilesQuery)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob(); // Get the response body as a Blob
        })
        .then(blob => {
          const a = document.createElement('a');
          const blobUrl = URL.createObjectURL(blob);
          a.href = blobUrl;
          a.download = `${(downloadKey[0] === '0' || downloadKey[0] === '1') ? `Intersect(${cellGroupings.intersect.map(vals => vals[0]).flat().join(',')})${cellGroupings.exclude.length > 0 ? `Except(${cellGroupings.exclude.map(vals => vals[0]).flat().join(',')})` : ''}` : downloadKey}.bed`
          a.click();
          URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error fetching the file:', error);
        });
      setDownloading(false)
    } catch (error) {
      console.log("Something went wrong when attempting to download:\n" + error)
      setDownloading(false)
    }
  }, [setDownloading, upSetQueryGroups, upSetClasses, getiCREFileURL]);

  /**
   * 
   * @param cell CellTypeInfo
   * @param want "S" | "U" | "B" The query value(s) wanted
   * @returns array of strings or string arrays. If values are within a nested array, they need to be unioned.
   */
  const extractQueryValues = (cell: CellTypeInfo, want: "S" | "U" | "B"): (string[]) => {
    switch (want) {
      case "U": return [...Object.values(cell.queryValues.unstimulated).flat()]
      case "S": return [...Object.values(cell.queryValues.stimulated).flat()]
      case "B": return Object.values(cell.queryValues.unstimulated).flat().concat((Object.values(cell.queryValues.stimulated).flat()))
    }
  }

  /**
   * Programmatically generates a gql document node with the needed queries for generating the UpSet plot
   * @param selectedCells
   * @param classes the selected cCRE classes
   * @returns gql query string for UpSet plot
   */
  const generateQuery = useCallback((selectedCells: CellTypeInfo[], classes: CCRE_CLASS[]) => {
    //stores extracted relevant information from selectedCells
    let cells: { displayName: string, queryVals: string[] }[] = [];

    //Out of selectedCells, extract relevant information. Create two entries for cells with "B" stimulation to iterate through more easily later
    selectedCells.forEach(cell => {
      if (cell.stimulated == "B") {
        cells.push({ displayName: cell.id.replace('-', '_') + '_U', queryVals: extractQueryValues(cell, "U") })
        cells.push({ displayName: cell.id.replace('-', '_') + '_S', queryVals: extractQueryValues(cell, "S") })
      } else cells.push({ displayName: cell.id.replace('-', '_') + '_' + cell.stimulated, queryVals: extractQueryValues(cell, cell.stimulated) })
    })

    //Holds the combination of union/intersection/exlude and name for each query
    let queryGroups: QueryGroup[] = []

    //Union of all cells
    if (selectedCells.length > 0) {
      queryGroups.push({ union: selectedCells.map(cell => extractQueryValues(cell, cell.stimulated)).flat(2), name: 'Union_All' })
    }

    //Individual counts
    cells.forEach((cell, i) => {
      //Need to pad name with underscore since GQL alias cannot start with number. Index attached to alias to preserve order
      queryGroups.push({ union: cell.queryVals, name: '_' + i.toString() + cell.displayName })
    })

    /**
     * Using binary strings to represent unique intersection/subtraction combinations for UpSet plot.
     * Binary strings from 1 to (2^n - 1) generated, and each celltype is mapped to an index/place 
     * in the string to determine if that cell is to be intersected or excluded/subtracted
     * 
     * Example for 2 cells, A and B:
     * 
     * A B
     * 0 1 -> exclude A, intersect B
     * 1 0 -> intersect A, exclude B
     * 1 1 -> intersect A and B, exclude none
     * 
     */
    let n = cells.length
    let binaryStrings: string[] = []
    for (let i = 1; i < (2 ** n); i++) {
      binaryStrings.push(i.toString(2).padStart(n, '0')) //Create array of binary strings
    }

    //For each binary string, assign each cell to be intersected or excluded based on 1/0 in string
    binaryStrings.forEach((str) => {
      let grouping: QueryGroup = { intersect: [], exclude: [], name: `UpSet_${str}` }
      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === '1') {
          grouping.intersect.push(cells[i].queryVals)
        } else grouping.exclude.push(cells[i].queryVals)
      }
      queryGroups.push(grouping)
    })

    // Store query groups used to generate plot. Set keys to match data used by UpSet plot
    setUpSetQueryGroups(Object.fromEntries(queryGroups.map(group => {
      let key: string;
      if (group.name === "Union_All") {
        key = "Union_All"
      } else if (group.name.includes("UpSet_")) {
        key = group.name.slice(6) // Ex: UpSet_0101 --> 0101
      } else if (group.name[0] === '_') {
        key = group.name.slice(2) //Ex: _01Bulk_B_U -> Bulk_B_U
      } else throw new Error("Error parsing queryGroups in setUpSetQueryGroups")
      return ([key, group])
    })))

    const iCREQuery = `{
      ${queryGroups.map(group => `${group.name}: iCREsCountQuery(
        ${generateQueryBody(group, classes)}
      )`).join('\n\n')}
    }`

    //Join query strings and parse into query document
    return (gql(iCREQuery))
  }, [])


  /**
   * @todo This is maybe a suboptimal way of generating queries. Maybe Directives would be better versus constructing these manually.
   * See https://graphql.org/learn/queries/#directives
   * and https://www.apollographql.com/blog/batching-client-graphql-queries#can-batching-be-done-manually
   * 
   * @param queryGroup
   * @param groups
   * @returns inside part of query to be used in iCREsCountQuery or createicresFilesQuery
   */
  const generateQueryBody = (queryGroup: QueryGroup, classes: CCRE_CLASS[]): string => {
    if (queryGroup.union) {
      return (
        //All passed as one nested array to get union of all
        `celltypes: [[\"${queryGroup.union.join('\", \"')}\"]]`
        + `group: [\"${classes.join('\", \"')}\"]`
      )
    } else if (queryGroup.intersect && !queryGroup.union) {
      return (
        `celltypes: [${queryGroup.intersect.map((vals: string[]) => `["${vals.join('", "')}"]`).join(', ')}]`
        + `${queryGroup?.exclude.length > 0 ? `\nexcludecelltypes: [${queryGroup.exclude.map((vals: string[]) => `["${vals.join('", "')}"]`).join(', ')}]` : ''}`
        + `group: [\"${classes.join('\", \"')}\"]`
      )
    } else if ((!queryGroup.intersect && !queryGroup.union) || (queryGroup.intersect && queryGroup.union)) {
      throw new Error("Something went wrong generating query groups, check: " + JSON.stringify(queryGroup))
    }
  }

  /**
   * Transforms return data into the format used by UpSet plot
   * @param data return data from gql
   * @returns data for use in making the UpSet plot
   */
  const transformtoUpSet = (data: { [key: string]: number }): { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] } => {
    let returnData: { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] } = { intersections: [], counts: [], order: [] }

    //Iterate through each query's return data
    Object.entries(data).forEach((x: [string, number]) => {
      //Union_All return data is not actually used to make the Plot, union size is just calculated. This checks to make sure that calculation is correct by comparing to expected value.
      if (x[0] === "Union_All") {
        const calculated = Object.entries(data)
          .filter(y => { return !(y[0] === "Union_All" || y[0].charAt(0) === "_") })
          .reduce((accumulator, element) => accumulator + element[1], 0)
        if (x[1] !== calculated) {
          throw new Error("Expected total union size doesn't match calculated total" + "Expected: " + x[1] + " Calculated: " + calculated)
        }
      } else if (x[0].charAt(0) === "_") { //If character is '_' it's the query for individual counts
        returnData.counts.push({ name: x[0].slice(2), count: x[1] }) //push cell name stripped of number and counts
        returnData.order.push(x[0].slice(1)) //For order, push cell stripped of leading underscore. Keep number for sorting
      } else if (x[0].includes("UpSet_")) {
        returnData.intersections.push({ name: x[0].slice(6), count: x[1] })
      } else throw new Error("Error parsing gql return data to UpSet data: Unknown key")
    })

    returnData.order = returnData.order.sort((a, b) => +a.charAt[0] - +b.charAt[0]).map(x => x.slice(1)) //sort returnData.order based on leading number, then strip leading numbers

    return (
      returnData
    )
  }

  /**
   * Stores selected cells and classes, and begins the fetch
   */
  const handleGenerateUpSet = () => {
    setUpSetCells(Object.values(cellTypeState).filter((x: CellTypeInfo) => x.selected))
    setUpSetClasses(Object.entries(checkboxClasses).filter((x: [string, boolean]) => x[1]).map((y: [string, boolean]) => y[0] as CCRE_CLASS))
    getCountData()
  }

  const COUNT_QUERY = useMemo(() => {
    if (upSetCells.length > 0) {
      return (
        generateQuery(upSetCells, upSetClasses)
      )
    }
    //This is just a placeholder for when there is no valid query (no cells are selected). Never used. Seems suboptimal, probably a better way than this
    else return (
      gql`
        query count{
          iCREsCountQuery(
            celltypes: [[]]
          )
        }
        `
    )
  }, [upSetCells, upSetClasses, generateQuery])

  //Query for counts used to make UpSet
  const [getCountData, { data: data_count, loading: loading_count, error: error_count }] = useLazyQuery(COUNT_QUERY, { client })

  const cellTypeTreeWidth = 830
  const upSetWidth = 700
  const cellTreeSelectionLimit = 6

  //Wrap in useMemo to stop rerender of tree when cursor changes here
  const cellTypeTree = useMemo(() => {
    console.log("cellTypeTree useMemo running")
    return (
      <CellTypeTree
        width={cellTypeTreeWidth}
        height={1100}
        orientation="vertical"
        cellTypeState={cellTypeState}
        setCellTypeState={setCellTypeState}
        stimulateMode={stimulateMode}
        setStimulateMode={setStimulateMode}
        setCursor={setCursor}
        selectionLimit={cellTreeSelectionLimit}
        triggerAlert={handleOpenSnackbar}
      />
    )
  }, [cellTypeState, setCellTypeState, stimulateMode, setCursor])

  const upSet = useMemo(() => {
    if (data_count) {
      return (<UpSetPlot
        width={upSetWidth}
        height={500}
        data={transformtoUpSet(data_count)}
        setCursor={setCursor}
        handleDownload={handleUpsetDownload}
        loading={downloading}
      />)
    } else return <></>
  }, [data_count, downloading, upSetWidth, handleUpsetDownload])

  //These boolean values are used to disable buttons in certain situaions
  const noneSelected = !Object.values(cellTypeState).map(x => x.selected).find(x => x)
  const noneStimulated = Object.values(cellTypeState).filter(x => x.stimulable).map(x => x.stimulated).every(x => x === "U")
  const allStimulated = Object.values(cellTypeState).filter(x => x.stimulable).map(x => x.stimulated).every(x => x === "S")
  const allBothStimulated = Object.values(cellTypeState).filter(x => x.stimulable).map(x => x.stimulated).every(x => x === "B")

  const groupCheckbox = (group: CCRE_CLASS, key: number) => {
    return (
      <FormControlLabel
        key={key}
        label={classDisplaynames[group]}
        slotProps={{ typography: { maxWidth: "10rem" } }}
        control={
          <Checkbox
            checked={checkboxClasses[group]}
            onChange={(_, checked) => setCheckboxClasses({ ...checkboxClasses, [group]: checked })}
          />
        }
      />)
  }

  const Checkboxes = () =>
    <>
      <FormControlLabel
        label="All Classes"
        control={
          <Checkbox
            checked={Object.values(checkboxClasses).every(val => val === true)}
            indeterminate={!Object.values(checkboxClasses).every(val => val === checkboxClasses.CA)}
            onChange={(_, checked) => setCheckboxClasses({
              "CA-CTCF": checked,
              "CA-TF": checked,
              "CA-H3K4me3": checked,
              "TF": checked,
              "CA": checked,
              "pELS": checked,
              "dELS": checked,
              "PLS": checked,
            })}
          />
        }
      />
      <Box sx={{ display: 'flex', flexWrap: "wrap", flexDirection: 'column', ml: 3, maxHeight: "12rem", gap: "1rem", alignContent: "flex-start" }}>
        {Object.keys(checkboxClasses).map((group: CCRE_CLASS, i) => groupCheckbox(group, i))}
      </Box>
    </>

  const HeaderAbout = () =>
    <>
      <Typography variant="h5">UpSet Generator</Typography>
      <Typography variant="body1" paragraph maxWidth={cellTypeTreeWidth}>
        Select Up to 6 cells to generate an UpSet plot. For stimulable cells, hold Option/Command (MacOS) or Alt/Windows (Windows) and click to stimulate cell. By default, all cells are unstimulated. Stimulable cells can be unstimulated, stimulated, or both (counts as two selections). Stimulating a cell does not automatically select it. The more cells types that are selected, the longer it will take to generate. Click any bar/count in UpSet plot to download set (.BED)
      </Typography>
    </>

  const GenerateUpsetButton = () =>
    <LoadingButton loading={loading_count} loadingPosition="end" disabled={noneSelected} endIcon={<BarChartOutlinedIcon />} sx={{ textTransform: "none", m: 1 }} variant="contained" onClick={handleGenerateUpSet}>
      <span>{loading_count ? "Generating" : noneSelected ? "Select Cells to Generate UpSet" : "Generate UpSet"}</span>
    </LoadingButton>

  const StimulationWarning = () => 
    <Typography>Tip: Stimulating a cell does not automatically select it! Exit Stimulation Mode and click to select.</Typography>
  
  return (
    <>
      <Grid2 container mt={3} sx={{ cursor }} >
        <Grid2 xs={12} xl={5} container justifyContent={"center"}>
          {/* Display header, checkboxes and UpSet on left on big screen */}
          <Box display={{ xs: "none", xl: "block" }}>
            <HeaderAbout />
            <Box>
              <Checkboxes />
              <GenerateUpsetButton />
              {noneSelected && !noneStimulated && <StimulationWarning />}
              <Box>
                {upSet}
              </Box>
            </Box>
          </Box>
        </Grid2>
        <Grid2 xs={12} xl={7} container justifyContent={"center"}>
          <Box>
            {/* On smaller screen display header on top */}
            <Box display={{ xs: "block", xl: "none" }}>
              <HeaderAbout />
            </Box>
            <Stack spacing={1} direction="row" mb={3}>
              <Tooltip title="Tip: Holding Option/Command (MacOS) or Alt/Windows (Windows) will enter stimulate mode. Stimulating a cell does NOT select it.">
                <Button endIcon={stimulateMode ? <CancelOutlinedIcon /> : <AddBoxOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={handleToggleStimulateMode}>{stimulateMode ? 'Exit Stimulate Mode' : 'Enter Stimulate Mode'}</Button>
              </Tooltip>
              <Tooltip title="Note: Not all cells are stimulable">
                <Button disabled={allStimulated} endIcon={<FlashOnOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={() => handleStimulateAll("S")}>Stimulate All</Button>
              </Tooltip>
              <Button disabled={noneStimulated} endIcon={<FlashOffOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={() => handleStimulateAll("U")}>Unstimulate All</Button>
              <Tooltip title="Note: Not all cells are stimulable">
                <Button disabled={allBothStimulated} endIcon={<FlashAutoIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={() => handleStimulateAll("B")}>Stim + Unstim All</Button>
              </Tooltip>
              <Button disabled={noneSelected} endIcon={<UndoOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={handleUnselectAll}>Unselect All</Button>
            </Stack>
            {cellTypeTree}
            {/* On smaller screen display checkboxes and UpSet plot on bottom of tree */}
            <Box display={{ xs: "block", xl: "none" }}>
              <Checkboxes />
              <GenerateUpsetButton />
              {noneSelected && !noneStimulated && <StimulationWarning />}
              <Box>
                {upSet}
              </Box>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
      <Snackbar
        sx={{ "& .MuiSnackbarContent-message": { margin: "auto" } }}
        open={openSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  )
}

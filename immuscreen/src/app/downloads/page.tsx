'use client'
import * as React from "react"
import CellTypeTree from "./cellTypeTree"
import { useMemo, useState } from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Tooltip } from "@mui/material";
/**
 * @todo add hover info on cells (how many cCREs active)
 */

export interface CellTypeInfo {
  readonly id: string; // used to set state of correct celltype afer its content is spread (...) into tree data and stripped of key name. Needs to match key exactly
  readonly displayName: string;
  readonly imagePath: string;
  selected: boolean;
  stimulated: boolean;
  readonly selectable: boolean;
  readonly stimulable: boolean;
  readonly queryValues?: {
    readonly unstimulated: string;
    readonly stimulated?: string;
  }
}

export interface CellTypes {
  Monocytes: CellTypeInfo,
  Myeloid_DCs: CellTypeInfo,
  pDCs: CellTypeInfo,
  Bulk_B: CellTypeInfo,
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
  CD8pos_T: CellTypeInfo,
  Naive_CD8_T: CellTypeInfo,
  Central_memory_CD8pos_T: CellTypeInfo,
  Effector_memory_CD8pos_T: CellTypeInfo,
  Gamma_delta_T: CellTypeInfo,
  Immature_NK: CellTypeInfo,
  Mature_NK: CellTypeInfo,
  Memory_NK: CellTypeInfo,
}

//Initial configuration of the cell type tree
//To break displayName into multiple lines, use '/'
const cellTypeInitialState: CellTypes = {
  Monocytes: {
    id: 'Monocytes',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Monocyte",
    imagePath: '/cellTypes/Monocytes.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Monocytes-U',
      stimulated: 'Monocytes-S'
    },
  },
  Myeloid_DCs: {
    id: 'Myeloid_DCs',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Myeloid/dendritic cell",
    imagePath:  '/cellTypes/Myeloid_DCs.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Myeloid_DCs-U'
    },
  },
  pDCs: {
    id: 'pDCs',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Plasmacytoid/dendritic cell",
    imagePath: '/cellTypes/pDCs.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'pDCs-U'
    },
  },
  Bulk_B: {
    id: 'Bulk_B',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Bulk/B cell",
    imagePath: '/cellTypes/Bulk_B.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Bulk_B-U',
      stimulated: 'Bulk_B-S'
    },
  },
  Naive_B: {
    id: 'Naive_B',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve/B cell",
    imagePath: '/cellTypes/Naive_B.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_B-U',
      stimulated: 'Naive_B-S'
    },
  },
  Mem_B: {
    id: 'Mem_B',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory/B cell",
    imagePath: '/cellTypes/Mem_B.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Mem_B-U',
      stimulated: 'Mem_B-S'
    },
  },
  Plasmablasts: {
    id: 'Plasmablasts',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Plasmablast",
    imagePath: '/cellTypes/Plasmablasts.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Plasmablasts-U'
    },
  },
  Regulatory_T: {
    id: 'Regulatory_T',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Regulatory/CD4+ T cell",
    imagePath: '/cellTypes/Regulatory_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Regulatory_T-U',
      stimulated: 'Regulatory_T-S'
    },
  },
  Naive_Tregs: {
    id: 'Naive_Tregs',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve T/regulatory cell",
    imagePath: '/cellTypes/Naive_Tregs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_Tregs-U',
      stimulated: 'Naive_Tregs-S'
    },
  },
  Memory_Tregs: {
    id: 'Memory_Tregs',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory T/regulatory cell",
    imagePath: '/cellTypes/Memory_Tregs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Memory_Tregs-U',
      stimulated: 'Memory_Tregs-S'
    },
  },
  Effector_CD4pos_T: {
    id: 'Effector_CD4pos_T',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Effector/CD4+ T cell",
    imagePath: '/cellTypes/Effector_CD4pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Effector_CD4pos_T-U',
      stimulated: 'Effector_CD4pos_T-S'
    },
  },
  Naive_Teffs: {
    id: 'Naive_Teffs',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve T/effector cell",
    imagePath: '/cellTypes/Naive_teffs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_Teffs-U',
      stimulated: 'Naive_Teffs-S'
    },
  },
  Memory_Teffs: {
    id: 'Memory_Teffs',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory T/effector cell",
    imagePath: '/cellTypes/Memory_Teffs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Memory_Teffs-U',
      stimulated: 'Memory_Teffs-S'
    },
  },
  Th1_precursors: {
    id: 'Th1_precursors',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Th1/precursor",
    imagePath: '/cellTypes/Th1_precursors.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Th1_precursors-U',
      stimulated: 'Th1_precursors-S'
    },
  },
  Th2_precursors: {
    id: 'Th2_precursors',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Th2/precursor",
    imagePath: '/cellTypes/Th2_precursors.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Th2_precursors-U',
      stimulated: 'Th2_precursors-S'
    },
  },
  Th17_precursors: {
    id: 'Th17_precursors',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Th17/precursor",
    imagePath: '/cellTypes/Th17_precursors.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Th17_precursors-U',
      stimulated: 'Th17_precursors-S'
    },
  },
  Follicular_T_Helper: {
    id: 'Follicular_T_Helper',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "T follicular/helper cell",
    imagePath: '/cellTypes/Follicular_T_helper.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Follicular_T_Helper-U',
      stimulated: 'Follicular_T_Helper-S'
    },
  },
  CD8pos_T: {
    id: 'CD8pos_T',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "CD8+ T cell",
    imagePath: '/cellTypes/CD8pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'CD8pos_T-U',
      stimulated: 'CD8pos_T-S'
    },
  },
  Naive_CD8_T: {
    id: 'Naive_CD8_T',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve CD8+/T cell",
    imagePath: '/cellTypes/Naive_CD8_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_CD8_T-U',
      stimulated: 'Naive_CD8_T-S'
    },
  },
  Central_memory_CD8pos_T: {
    id: 'Central_memory_CD8pos_T',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Central/memory/CD8+ T cell",
    imagePath: '/cellTypes/Central_Memory_CD8pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Central_memory_CD8pos_T-U',
      stimulated: 'Central_memory_CD8pos_T-S'
    },
  },
  Effector_memory_CD8pos_T: {
    id: 'Effector_memory_CD8pos_T',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Effector/memory/CD8+ T cell",
    imagePath: '/cellTypes/Effector_memory_CD8pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Effector_memory_CD8pos_T-U',
      stimulated: 'Effector_memory_CD8pos_T-S'
    },
  },
  Gamma_delta_T: {
    id: 'Gamma_delta_T',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Gamma-delta/T cell",
    imagePath: '/cellTypes/Gamma_delta_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Gamma_delta_T-U',
      stimulated: 'Gamma_delta_T-S'
    },
  },
  Immature_NK: {
    id: 'Immature_NK',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Immature/NK cell",
    imagePath: '/cellTypes/Immature_NK.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Immature_NK-U'
    },
  },
  Mature_NK: {
    id: 'Mature_NK',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Mature/NK cell",
    imagePath: '/cellTypes/Mature_NK.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Mature_NK-U',
      stimulated: 'Mature_NK-S'
    },
  },
  Memory_NK: {
    id: 'Memory_NK',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory/NK cell",
    imagePath: '/cellTypes/Memory_NK.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Memory_NK-U'
    },
  },
}

export default function Downloads({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [cellTypeState, setCellTypeState] = useState<CellTypes>(cellTypeInitialState)
  const [stimulateMode, setStimulateMode] = useState<boolean>(false)
  const [cursor, setCursor] = useState<'auto' | 'pointer' | 'cell' | 'not-allowed'>('auto')

  const handleStimulateAll = (x: boolean) => {
    let newObj = {...cellTypeState}
    for (let cellName in newObj) {
      newObj[cellName].stimulable && (newObj[cellName].stimulated = x)
    }
    setCellTypeState(newObj)
  }

  const handleSelectAll = (x: boolean) => {
    let newObj = {...cellTypeState}
    for (let cellName in newObj) {
      newObj[cellName].selectable && (newObj[cellName].selected = x)
    }
    setCellTypeState(newObj)
  }

  const handleToggleStimulateMode = () => {
    setStimulateMode(!stimulateMode)
    setCursor(!stimulateMode ? 'cell' : 'auto')
  }

  //Wrap in useMemo to stop rerender of tree when cursor changes here
  const cellTypeTree = useMemo(() => {
    return (
      <CellTypeTree
        width={1000}
        height={1000}
        cellTypeState={cellTypeState}
        setCellTypeState={setCellTypeState}
        stimulateMode={stimulateMode}
        setCursor={setCursor}
      />
    )
  }, [cellTypeState, setCellTypeState, stimulateMode, setCursor])

  return (
    <Grid2 container mt={3} spacing={2} sx={{cursor}}>
      <Grid2 xs={12} lg={8}>
        {cellTypeTree}
      </Grid2>
      <Grid2 xs={12} lg={4}>
        <Tooltip title="Note: Dendritic cells, plasmablasts and immature/memory NK cells are not stimulable">
          <Button variant="outlined" onClick={() => handleStimulateAll(true)}>Stimulate All</Button>
        </Tooltip>
        <Button variant="outlined" onClick={() => handleStimulateAll(false)}>Unstimulate All</Button>
        <Button variant="outlined" onClick={handleToggleStimulateMode}>{stimulateMode ? 'Exit Stimulate Mode' : 'Enter Stimulate Mode'}</Button>
        <Tooltip title="Note: Not all cells are selectable">
          <Button variant="outlined" onClick={() => handleSelectAll(true)}>Select All</Button>
        </Tooltip>
        <Button variant="outlined" onClick={() => handleSelectAll(false)}>Unselect All</Button>
      </Grid2>
    </Grid2>
  )
}

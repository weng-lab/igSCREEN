'use client'
import * as React from "react"
import CellTypeTree from "./cellTypeTree"
import { useState } from "react"
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
  justClicked: boolean; //workaround for onMouseEnter function being fired directly after onClick (unintended visual consequences)
  readonly queryValues?: {
    readonly unstimulated: string;
    readonly stimulated?: string;
  } & (CellTypeInfo['stimulable'] extends true ? { stimulated: string } : {});
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
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
    justClicked: false
  },
  Mature_NK: {
    id: 'Mature_NK',
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Mature NK cell",
    imagePath: '/cellTypes/Mature_NK.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Mature_NK-U',
      stimulated: 'Mature_NK-S'
    },
    justClicked: false
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
    justClicked: false
  },
}

export default function Downloads({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [cellTypeState, setCellTypeState] = useState<CellTypes>(cellTypeInitialState)

  return (
    <main>
      <CellTypeTree width={1000} height={1000} cellTypeState={cellTypeState} setCellTypeState={setCellTypeState}/>
    </main>
  )
}

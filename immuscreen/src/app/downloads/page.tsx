'use client'
import * as React from "react"
import CellTypeTree from "./cellTypeTree"
import { useState } from "react"

export interface CellTypeInfo {
  readonly displayName: string;
  readonly imagePath: string;
  selected: boolean;
  stimulated: boolean;
  readonly selectable: boolean;
  readonly stimulable: boolean;
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
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Monocyte",
    imagePath: '/cellTypes/Monocytes.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Monocytes-U',
      stimulated: 'Monocytes-S'
    }
  },
  Myeloid_DCs: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Myeloid/dendritic cell",
    imagePath:  '/cellTypes/Myeloid_DCs.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Myeloid_DCs-U'
    }
  },
  pDCs: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Plasmacytoid/dendritic cell",
    imagePath: '/cellTypes/pDCs.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'pDCs-U'
    }
  },
  Bulk_B: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Bulk/B cell",
    imagePath: '/cellTypes/Bulk_B.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Bulk_B-U',
      stimulated: 'Bulk_B-S'
    }
  },
  Naive_B: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve/B cell",
    imagePath: '/cellTypes/Naive_B.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_B-U',
      stimulated: 'Naive_B-S'
    }
  },
  Mem_B: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory/B cell",
    imagePath: '/cellTypes/Mem_B.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Mem_B-U',
      stimulated: 'Mem_B-S'
    }
  },
  Plasmablasts: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Plasmablast",
    imagePath: '/cellTypes/Plasmablasts.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Plasmablasts-U'
    }
  },
  Regulatory_T: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Regulatory/CD4+ T cell",
    imagePath: '/cellTypes/Regulatory_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Regulatory_T-U',
      stimulated: 'Regulatory_T-S'
    }
  },
  Naive_Tregs: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve T/regulatory cell",
    imagePath: '/cellTypes/Naive_Tregs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_Tregs-U',
      stimulated: 'Naive_Tregs-S'
    }
  },
  Memory_Tregs: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory T/regulatory cell",
    imagePath: '/cellTypes/Memory_Tregs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Memory_Tregs-U',
      stimulated: 'Memory_Tregs-S'
    }
  },
  Effector_CD4pos_T: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Effector/CD4+ T cell",
    imagePath: '/cellTypes/Effector_CD4pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Effector_CD4pos_T-U',
      stimulated: 'Effector_CD4pos_T-S'
    }
  },
  Naive_Teffs: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve T/effector cell",
    imagePath: '/cellTypes/Naive_teffs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_Teffs-U',
      stimulated: 'Naive_Teffs-S'
    }
  },
  Memory_Teffs: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory T/effector cell",
    imagePath: '/cellTypes/Memory_Teffs.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Memory_Teffs-U',
      stimulated: 'Memory_Teffs-S'
    }
  },
  Th1_precursors: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Th1/precursor",
    imagePath: '/cellTypes/Th1_precursors.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Th1_precursors-U',
      stimulated: 'Th1_precursors-S'
    }
  },
  Th2_precursors: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Th2/precursor",
    imagePath: '/cellTypes/Th2_precursors.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Th2_precursors-U',
      stimulated: 'Th2_precursors-S'
    }
  },
  Th17_precursors: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Th17/precursor",
    imagePath: '/cellTypes/Th17_precursors.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Th17_precursors-U',
      stimulated: 'Th17_precursors-S'
    }
  },
  Follicular_T_Helper: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "T follicular/helper cell",
    imagePath: '/cellTypes/Follicular_T_helper.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Follicular_T_Helper-U',
      stimulated: 'Follicular_T_Helper-S'
    }
  },
  CD8pos_T: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "CD8+ T cell",
    imagePath: '/cellTypes/CD8pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'CD8pos_T-U',
      stimulated: 'CD8pos_T-S'
    }
  },
  Naive_CD8_T: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Naïve CD8+/T cell",
    imagePath: '/cellTypes/Naive_CD8_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Naive_CD8_T-U',
      stimulated: 'Naive_CD8_T-S'
    }
  },
  Central_memory_CD8pos_T: {
    selected: true,
    stimulated: false,
    selectable: true,
    displayName: "Central/memory/CD8+ T cell",
    imagePath: '/cellTypes/Central_Memory_CD8pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Central_memory_CD8pos_T-U',
      stimulated: 'Central_memory_CD8pos_T-S'
    }
  },
  Effector_memory_CD8pos_T: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Effector/memory/CD8+ T cell",
    imagePath: '/cellTypes/Effector_memory_CD8pos_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Effector_memory_CD8pos_T-U',
      stimulated: 'Effector_memory_CD8pos_T-S'
    }
  },
  Gamma_delta_T: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Gamma-delta/T cell",
    imagePath: '/cellTypes/Gamma_delta_T.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Gamma_delta_T-U',
      stimulated: 'Gamma_delta_T-S'
    }
  },
  Immature_NK: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Immature/NK cell",
    imagePath: '/cellTypes/Immature_NK.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Immature_NK-U'
    }
  },
  Mature_NK: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Mature NK cell",
    imagePath: '/cellTypes/Mature_NK.png',
    stimulable: true,
    queryValues: {
      unstimulated: 'Mature_NK-U',
      stimulated: 'Mature_NK-S'
    }
  },
  Memory_NK: {
    selected: false,
    stimulated: false,
    selectable: true,
    displayName: "Memory/NK cell",
    imagePath: '/cellTypes/Memory_NK.png',
    stimulable: false,
    queryValues: {
      unstimulated: 'Memory_NK-U'
    }
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

export type CellName = "Myeloid_DCs" | "pDCs" | "Naive_B" | "Mem_B" | "Plasmablasts" | "Regulatory_T" | "Naive_Tregs" | "Memory_Tregs" | "Effector_CD4pos_T" | "Naive_Teffs" | "Memory_Teffs" | "Th1_precursors" | "Th2_precursors" | "Th17_precursors" | "Follicular_T_Helper" | "Naive_CD8_T" | "Central_memory_CD8pos_T" | "Effector_memory_CD8pos_T" | "Gamma_delta_T" | "Immature_NK" | "Mature_NK" | "Memory_NK" | "HSC" | "MPP" | "CMP" | "MEP" | "Ery" | "GMP" | "LMPP" | "CLP" | "CD4Tcell" | "Nkcell" | "Monocytes" | "Bulk_B" | "CD8pos_T";

const cellNames: CellName[] = ["Myeloid_DCs", "pDCs", "Naive_B", "Mem_B", "Plasmablasts", "Regulatory_T", "Naive_Tregs", "Memory_Tregs", "Effector_CD4pos_T", "Naive_Teffs", "Memory_Teffs", "Th1_precursors", "Th2_precursors", "Th17_precursors", "Follicular_T_Helper", "Naive_CD8_T", "Central_memory_CD8pos_T", "Effector_memory_CD8pos_T", "Gamma_delta_T", "Immature_NK", "Mature_NK", "Memory_NK", "HSC", "MPP", "CMP", "MEP", "Ery", "GMP", "LMPP", "CLP", "CD4Tcell", "Nkcell", "Monocytes", "Bulk_B", "CD8pos_T"]

// Static information for each cell
export type StaticCellTypeInfo = {
  readonly id: CellName;
  readonly displayName: string;
  readonly unstimImagePath: string;
  readonly stimImagePath?: string;
  readonly unstimCount: number
  readonly stimCount?: number
  readonly stimulable: boolean;
  readonly queryValues?: {
    readonly unstimulated: { Calderon?: string | string[], Corces?: string | string[] };
    readonly stimulated?: { Calderon: string | string[] }
  }
}

// Dynamic information that changes depending on use case
export type DynamicCellTypeInfo = {
  selected: boolean;
  stimulated: "S" | "U" | "B";
  readonly selectable: boolean;
}

export type CellLineageTreeState = { [key in CellName]: DynamicCellTypeInfo }



export const cellLineageTreeStaticInfo: { [key in CellName]: StaticCellTypeInfo } = {
  //Using Calderon "name". Using Calderon's Stimulated/Unstimulated. In Corces it is "Mono", and no stimulation info
  Monocytes: {
    id: 'Monocytes',
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
    displayName: "Plasmacytoid/dendritic cell",
    unstimImagePath: '/cellTypes/pDCs-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'pDCs-U' }
    },
    unstimCount: 146515
  },
  //Using Calderon "name". Using Calderon's Stimulated/Unstimulated. In Corces it is "Bcell", and no stimulation info
  Bulk_B: {
    id: 'Bulk_B',
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
  //Using Calderon "name". Using Calderon's Stimulated/Unstimulated. In Corces it is "CD8Tcell", and no stimulation info
  CD8pos_T: {
    id: 'CD8pos_T',
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
    displayName: "Granulocyte-monocyte/progenitors",
    unstimImagePath: '/cellTypes/GMP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "GMP" }
    },
    unstimCount: 158558
  },
  LMPP: {
    id: "LMPP",
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
    displayName: "NK cell",
    unstimImagePath: '/cellTypes/Nkcell.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "NKcell" }
    },
    unstimCount: 116626
  }
}

/**
 * 
 * @param cell CellTypeInfo
 * @param want "S" | "U" | "B" The query value(s) wanted
 * @returns array of strings or string arrays. If values are within a nested array, they need to be unioned.
 */
export const extractQueryValues = (cell: StaticCellTypeInfo, want: "S" | "U" | "B"): (string[]) => {
  console.log(cell)
  switch (want) {
    case "U": return cell.queryValues?.unstimulated ? [... Object.values(cell.queryValues.unstimulated).flat()] : []
    case "S": return cell.queryValues?.stimulated ? [... Object.values(cell.queryValues.stimulated).flat()] : []
    case "B": return Object.values(cell.queryValues.unstimulated).flat().concat((Object.values(cell.queryValues.stimulated).flat()))
    case "B": return(cell.queryValues?.unstimulated ? Object.values(cell.queryValues.unstimulated).flat() : []).concat(cell.queryValues?.stimulated ? (Object.values(cell.queryValues.stimulated).flat()) : [])
  }
}

/**
 * Initial Selected Cells being query values not cell names is convenient right now, but confusing. Consider changing in future to plain names, like {name: cellName, stim: "B" | "U" | "S"}
 * @param initialSelectedCells cells to select initially, needs to match query values like Bulk_B-U (NOT CELL NAMES).
 * @param interactive disables interacting with nodes
 */
export const generateCellLineageTreeState = (initialSelectedCells: string[], interactive: boolean): CellLineageTreeState => {
  //Some iCREs are active in celltypes (Ex: Blast) that are not in the tree. Need to handle this case. Ex: EH38E0243977 is active in Blast
  let cellLineageTreeState = {} as CellLineageTreeState

  for (const cellName of cellNames) {
    //Try to find matches in the query values of cellLineageTreeStaticInfo
    const unstimSelected = initialSelectedCells.some(cell => extractQueryValues(cellLineageTreeStaticInfo[cellName], "U").includes(cell))
    const stimSelected = initialSelectedCells.some(cell => extractQueryValues(cellLineageTreeStaticInfo[cellName], "S").includes(cell))
    cellLineageTreeState[cellName] = {
      selected: unstimSelected || stimSelected,
      selectable: interactive,
      stimulated: 
        (unstimSelected && stimSelected) ? "B" :
        (unstimSelected && !stimSelected) ? "U" :
        (!unstimSelected && stimSelected) ? "S" :
        "U"
    }
  }

  return cellLineageTreeState
}

const svgData = (_svg): string => {
  let svg = _svg.cloneNode(true);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  let preface = '<?xml version="1.0" standalone="no"?>';
  return preface + svg.outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
};

const downloadData = (text: string, filename: string, type: string = 'text/plain') => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadSVG = (ref: React.MutableRefObject<SVGSVGElement>, filename: string) =>{
  ref.current && downloadData(svgData(ref.current!), filename, 'image/svg;charset=utf-8');
}
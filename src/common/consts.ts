import { CellName, CellTypeStaticInfo } from "../app/celllineage/types"

export const studyLinks = {
  "Calderon..Pritchard 2019": "https://doi.org/10.1038/s41588-019-0505-9",
  "Corces..Chang 2016": "https://doi.org/10.1038/ng.3646",
  "ENCODE": "https://www.encodeproject.org/"
}

export const cellCategoryColors = {
  Bcells: "#078fff",
  Bulk_Tcells: "#e06666",
  CD4_Tcells: "#990000",
  CD8_Tcells: "#f6b26b",
  Erythroblasts: "#684fda",
  Leukemia: "#1ab19a",
  Myeloid: "#a64d79",
  NK: "#93c47d",
  Progenitors: "#d3b2ce",
  gd_Tcells: "#ff9900"
}

export const cellCategoryDisplaynames = {
  Bcells: "B Cells",
  Bulk_Tcells: "Bulk T Cells",
  CD4_Tcells: "CD4 T Cells",
  CD8_Tcells: "CD8 T Cells",
  Erythroblasts: "Erythroblasts",
  Leukemia: "Leukemic Cells",
  Myeloid: "Myeloid Cells",
  NK: "Natural Killer Cells",
  Progenitors: "Progenitor Cells",
  gd_Tcells: "Gamma Delta T Cells"
}

export const cellTypeStaticInfo: { [key in CellName]: CellTypeStaticInfo } = {
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
    stimCount: 100461,
    color: "#d043ff",
    treeDisplayName: "Monocyte"
  },
  Myeloid_DCs: {
    id: 'Myeloid_DCs',
    displayName: "Myeloid dendritic cell",
    unstimImagePath: '/cellTypes/Myeloid_DCs-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: "Myeloid_DCs-U" }
    },
    unstimCount: 173394,
    color: "#a64d79",
    treeDisplayName: "Myeloid/dendritic cell"
  },
  pDCs: {
    id: 'pDCs',
    displayName: "Plasmacytoid dendritic cell",
    unstimImagePath: '/cellTypes/pDCs-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'pDCs-U' }
    },
    unstimCount: 146515,
    color: "#741b47",
    treeDisplayName: "Plasmacytoid/dendritic cell"
  },
  //Using Calderon "name". Using Calderon's Stimulated/Unstimulated. In Corces it is "Bcell", and no stimulation info
  Bulk_B: {
    id: 'Bulk_B',
    displayName: "Bulk B cell",
    unstimImagePath: '/cellTypes/Bulk_B-U.png',
    stimImagePath: '/cellTypes/Bulk_B-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Bulk_B-U', Corces: "Bcell" },
      stimulated: { Calderon: 'Bulk_B-S' }
    },
    unstimCount: 138138,
    stimCount: 124969,
    color: "#078fff",
    treeDisplayName: "Bulk/B cell"
  },
  Naive_B: {
    id: 'Naive_B',
    displayName: "Naïve B cell",
    unstimImagePath: '/cellTypes/Naive_B-U.png',
    stimImagePath: '/cellTypes/Naive_B-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_B-U' },
      stimulated: { Calderon: 'Naive_B-S' }
    },
    unstimCount: 120624,
    stimCount: 128979,
    color: "#073763",
    treeDisplayName: "Naïve/B cell"
  },
  Mem_B: {
    id: 'Mem_B',
    displayName: "Memory B cell",
    unstimImagePath: '/cellTypes/Mem_B-U.png',
    stimImagePath: '/cellTypes/Mem_B-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Mem_B-U' },
      stimulated: { Calderon: 'Mem_B-S' }
    },
    unstimCount: 122662,
    stimCount: 129491,
    color: "#1155cc",
    treeDisplayName: "Memory/B cell"
  },
  Plasmablasts: {
    id: 'Plasmablasts',
    displayName: "Plasmablast",
    unstimImagePath: '/cellTypes/Plasmablasts-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'Plasmablasts-U' }
    },
    unstimCount: 123042,
    color: "#1606f7",
    treeDisplayName: "Plasmablast"
  },
  Regulatory_T: {
    id: 'Regulatory_T',
    displayName: "Regulatory CD4+ T cell",
    unstimImagePath: '/cellTypes/Regulatory_T-U.png',
    stimImagePath: '/cellTypes/Regulatory_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Regulatory_T-U' },
      stimulated: { Calderon: 'Regulatory_T-S' }
    },
    unstimCount: 124481,
    stimCount: 126696,
    color: "#cc0000",
    treeDisplayName: "Regulatory/CD4+ T cell"
  },
  Naive_Tregs: {
    id: 'Naive_Tregs',
    displayName: "Naïve T regulatory cell",
    unstimImagePath: '/cellTypes/Naive_Tregs-U.png',
    stimImagePath: '/cellTypes/Naive_Tregs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_Tregs-U' },
      stimulated: { Calderon: 'Naive_Tregs-S' }
    },
    unstimCount: 95731,
    stimCount: 100068,
    color: "#e06666",
    treeDisplayName: "Naïve T/regulatory cell"
  },
  Memory_Tregs: {
    id: 'Memory_Tregs',
    displayName: "Memory T regulatory cell",
    unstimImagePath: '/cellTypes/Memory_Tregs-U.png',
    stimImagePath: '/cellTypes/Memory_Tregs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Memory_Tregs-U' },
      stimulated: { Calderon: 'Memory_Tregs-S' }
    },
    unstimCount: 125459,
    stimCount: 121029,
    color: "#770000",
    treeDisplayName: "Memory T/regulatory cell"
  },
  Effector_CD4pos_T: {
    id: 'Effector_CD4pos_T',
    displayName: "Effector CD4+ T cell",
    unstimImagePath: '/cellTypes/Effector_CD4pos_T-U.png',
    stimImagePath: '/cellTypes/Effector_CD4pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Effector_CD4pos_T-U' },
      stimulated: { Calderon: 'Effector_CD4pos_T-S' }
    },
    unstimCount: 123382,
    stimCount: 137982,
    color: "#990000",
    treeDisplayName: "Effector/CD4+ T cell"
  },
  Naive_Teffs: {
    id: 'Naive_Teffs',
    displayName: "Naïve T effector cell",
    unstimImagePath: '/cellTypes/Naive_Teffs-U.png',
    stimImagePath: '/cellTypes/Naive_Teffs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_Teffs-U' },
      stimulated: { Calderon: 'Naive_Teffs-S' }
    },
    unstimCount: 117212,
    stimCount: 137523,
    color: "#ea9999",
    treeDisplayName: "Naïve T/effector cell"
  },
  Memory_Teffs: {
    id: 'Memory_Teffs',
    displayName: "Memory T effector cell",
    unstimImagePath: '/cellTypes/Memory_Teffs-U.png',
    stimImagePath: '/cellTypes/Memory_Teffs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Memory_Teffs-U' },
      stimulated: { Calderon: 'Memory_Teffs-S' }
    },
    unstimCount: 137523,
    stimCount: 148833,
    color: "#cc4125",
    treeDisplayName: "Memory T/effector cell"
  },
  Th1_precursors: {
    id: 'Th1_precursors',
    displayName: "Th1 precursor",
    unstimImagePath: '/cellTypes/Th1_precursors-U.png',
    stimImagePath: '/cellTypes/Th1_precursors-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Th1_precursors-U' },
      stimulated: { Calderon: 'Th1_precursors-S' }
    },
    unstimCount: 121879,
    stimCount: 145297,
    color: "#ff3535",
    treeDisplayName: "Th1/precursor"
  },
  Th2_precursors: {
    id: 'Th2_precursors',
    displayName: "Th2 precursor",
    unstimImagePath: '/cellTypes/Th2_precursors-U.png',
    stimImagePath: '/cellTypes/Th2_precursors-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Th2_precursors-U' },
      stimulated: { Calderon: 'Th2_precursors-S' }
    },
    unstimCount: 122826,
    stimCount: 141664,
    color: "#c93232",
    treeDisplayName: "Th2/precursor"
  },
  Th17_precursors: {
    id: 'Th17_precursors',
    displayName: "Th17 precursor",
    unstimImagePath: '/cellTypes/Th17_precursors-U.png',
    stimImagePath: '/cellTypes/Th17_precursors-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Th17_precursors-U' },
      stimulated: { Calderon: 'Th17_precursors-S' }
    },
    unstimCount: 128606,
    stimCount: 147883,
    color: "#ba1818",
    treeDisplayName: "Th17/precursor"
  },
  Follicular_T_Helper: {
    id: 'Follicular_T_Helper',
    displayName: "T follicular helper cell",
    unstimImagePath: '/cellTypes/Follicular_T_helper-U.png',
    stimImagePath: '/cellTypes/Follicular_T_helper-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Follicular_T_Helper-U' },
      stimulated: { Calderon: 'Follicular_T_Helper-S' }
    },
    unstimCount: 122084,
    stimCount: 136992,
    color: "#6c4141",
    treeDisplayName: "T follicular/helper cell"
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
    stimCount: 127042,
    color: "#ff9900",
    treeDisplayName: "CD8+ T cell"
  },
  Naive_CD8_T: {
    id: 'Naive_CD8_T',
    displayName: "Naïve CD8+ T cell",
    unstimImagePath: '/cellTypes/Naive_CD8_T-U.png',
    stimImagePath: '/cellTypes/Naive_CD8_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Naive_CD8_T-U' },
      stimulated: { Calderon: 'Naive_CD8_T-S' }
    },
    unstimCount: 100250,
    stimCount: 113028,
    color: "#f6b26b",
    treeDisplayName: "Naïve CD8+/T cell"
  },
  Central_memory_CD8pos_T: {
    id: 'Central_memory_CD8pos_T',
    displayName: "Central memory CD8+ T cell",
    unstimImagePath: '/cellTypes/Central_memory_CD8pos_T-U.png',
    stimImagePath: '/cellTypes/Central_memory_CD8pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Central_memory_CD8pos_T-U' },
      stimulated: { Calderon: 'Central_memory_CD8pos_T-S' }
    },
    unstimCount: 125778,
    stimCount: 136023,
    color: "#e69138",
    treeDisplayName: "Central/memory/CD8+ T cell"
  },
  Effector_memory_CD8pos_T: {
    id: 'Effector_memory_CD8pos_T',
    displayName: "Effector memory CD8+ T cell",
    unstimImagePath: '/cellTypes/Effector_Memory_CD8pos_T-U.png',
    stimImagePath: '/cellTypes/Effector_memory_CD8pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Effector_memory_CD8pos_T-U' },
      stimulated: { Calderon: 'Effector_memory_CD8pos_T-S' }
    },
    unstimCount: 145641,
    stimCount: 132761,
    color: "#f1c232",
    treeDisplayName: "Effector/memory/CD8+ T cell"
  },
  Gamma_delta_T: {
    id: 'Gamma_delta_T',
    displayName: "Gamma-delta T cell",
    unstimImagePath: '/cellTypes/Gamma_delta_T-U.png',
    stimImagePath: '/cellTypes/Gamma_delta_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Gamma_delta_T-U' },
      stimulated: { Calderon: 'Gamma_delta_T-S' }
    },
    unstimCount: 133605,
    stimCount: 116220,
    color: "#dc5e5e",
    treeDisplayName: "Gamma-delta/T cell"
  },
  Immature_NK: {
    id: 'Immature_NK',
    displayName: "Immature NK cell",
    unstimImagePath: '/cellTypes/Immature_NK-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'Immature_NK-U' }
    },
    unstimCount: 130554,
    color: "#5e957b",
    treeDisplayName: "Immature/NK cell"
  },
  Mature_NK: {
    id: 'Mature_NK',
    displayName: "Mature NK cell",
    unstimImagePath: '/cellTypes/Mature_NK-U.png',
    stimImagePath: '/cellTypes/Mature_NK-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: { Calderon: 'Mature_NK-U' },
      stimulated: { Calderon: 'Mature_NK-S' }
    },
    unstimCount: 119958,
    stimCount: 110082,
    color: "#008000",
    treeDisplayName: "Mature/NK cell"
  },
  Memory_NK: {
    id: 'Memory_NK',
    displayName: "Memory NK cell",
    unstimImagePath: '/cellTypes/Memory_NK-U.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Calderon: 'Memory_NK-U' }
    },
    unstimCount: 135352,
    color: "#93c47d",
    treeDisplayName: "Memory/NK cell"
  },
  HSC: {
    id: 'HSC',
    displayName: "Hematopoetic stem cell",
    unstimImagePath: '/cellTypes/HSC.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: ["HSC", "CD34_Cord_Blood", "CD34_Bone_Marrow"] }
    },
    unstimCount: 173583,
    color: "#595959",
    treeDisplayName: "Hematopoetic/stem cell"
  },
  MPP: {
    id: "MPP",
    displayName: "Multipotent progenitor",
    unstimImagePath: '/cellTypes/MPP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "MPP" }
    },
    unstimCount: 158945,
    color: "#9e9e9e",
    treeDisplayName: "Multipotent/progenitor"
  },
  CMP: {
    id: "CMP",
    displayName: "Common myeloid progenitor",
    unstimImagePath: '/cellTypes/CMP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "CMP" }
    },
    unstimCount: 159706,
    color: "#d3b2ce",
    treeDisplayName: "Common myeloid/progenitor"
  },
  MEP: {
    id: "MEP",
    displayName: "Megakaryocyte-erythroid progenitor",
    unstimImagePath: '/cellTypes/MEP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "MEP" }
    },
    unstimCount: 152044,
    color: "#b8a0cb",
    treeDisplayName: "Megakaryocyte-erythroid/progenitor"
  },
  Ery: {
    id: "Ery",
    displayName: "Erythroblast",
    unstimImagePath: '/cellTypes/Erythroblast.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "Ery" }
    },
    unstimCount: 56267,
    color: "#684fda",
    treeDisplayName: "Erythroblast"
  },
  GMP: {
    id: "GMP",
    displayName: "Granulocyte-monocyte progenitors",
    unstimImagePath: '/cellTypes/GMP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "GMP" }
    },
    unstimCount: 158558,
    color: "#865695",
    treeDisplayName: "Granulocyte-monocyte/progenitors"
  },
  LMPP: {
    id: "LMPP",
    displayName: "Lymphocyte-primed multipotent progenitor",
    unstimImagePath: '/cellTypes/LMP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "LMPP" }
    },
    unstimCount: 128494,
    color: "#c1d3ba",
    treeDisplayName: "Lymphocyte-primed/multipotent progenitor"
  },
  CLP: {
    id: "CLP",
    displayName: "Common lymphoid progenitor",
    unstimImagePath: '/cellTypes/CLP.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "CLP" }
    },
    unstimCount: 93170,
    color: "#d5c8ac",
    treeDisplayName: "Common lymphoid/progenitor"
  },
  CD4Tcell: {
    id: "CD4Tcell",
    displayName: "CD4+ T cell",
    unstimImagePath: '/cellTypes/CD4posT.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "CD4Tcell" }
    },
    unstimCount: 121034,
    color: "#5b1606",
    treeDisplayName: "CD4+ T cell"
  },
  NKcell: {
    id: "NKcell",
    displayName: "NK cell",
    unstimImagePath: '/cellTypes/Nkcell.png',
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "NKcell" }
    },
    unstimCount: 116626,
    color: "#2f4a15",
    treeDisplayName: "NK cell"
  },
  pHSC: {
    id: "pHSC",
    displayName: "Preleukemic Hematopoetic Stem Cells",
    unstimImagePath: null,
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "pHSC" }
    },
    unstimCount: 191307,
    color: "#25e6c9",
    treeDisplayName: ""
  },
  LSC: {
    id: "LSC",
    displayName: "Leukemia Stem Cells",
    unstimImagePath: null,
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "LSC" }
    },
    unstimCount: 192613,
    color: "#1ab19a",
    treeDisplayName: ""
  },
  Blast: {
    id: "Blast",
    displayName: "Leukemic Blast Cells",
    unstimImagePath: null,
    stimulable: false,
    queryValues: {
      unstimulated: { Corces: "Blast" }
    },
    unstimCount: 190471,
    color: "#107263",
    treeDisplayName: ""
  }
}

export const experimentInfo: { [key: string]: {order: number, description: string, displayName: string, group: string, study: string, pmid: string} } = {
  '1020-CD34_Cord_Blood-SRX1427814': { order: 1, description: 'CD34+ Cord Blood in donor 1020', displayName: 'CD34+ Cord Blood', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7291-CD34_Bone_Marrow-SRX1427812': { order: 2, description: 'CD34+ Bone Marrow in donor 7291', displayName: 'CD34+ Bone Marrow', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7292-CD34_Bone_Marrow-SRX1427813': { order: 3, description: 'CD34+ Bone Marrow in donor 7292', displayName: 'CD34+ Bone Marrow', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-HSC-SRX1427829': { order: 4, description: 'Hematopoetic Stem Cells in donor 2596', displayName: 'Hematopoetic stem ells', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-HSC-SRX1427830': { order: 5, description: 'Hematopoetic Stem Cells in donor 2596', displayName: 'Hematopoetic Stem Cells', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-HSC-SRX1427789': { order: 6, description: 'Hematopoetic Stem Cells in donor 4983', displayName: 'Hematopoetic Stem Cells', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-HSC-SRX1427800': { order: 7, description: 'Hematopoetic Stem Cells in donor 6792', displayName: 'Hematopoetic Stem Cells', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-HSC-SRX1427801': { order: 8, description: 'Hematopoetic Stem Cells in donor 6792', displayName: 'Hematopoetic Stem Cells', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-HSC-SRX1427854': { order: 9, description: 'Hematopoetic Stem Cells in donor 7256', displayName: 'Hematopoetic Stem Cells', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-HSC-SRX1427855': { order: 10, description: 'Hematopoetic Stem Cells in donor 7256', displayName: 'Hematopoetic Stem Cells', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-MPP-SRX1427832': { order: 11, description: 'Multipotent Progenitors in donor 2596', displayName: 'Multipotent Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-MPP-SRX1427833': { order: 12, description: 'Multipotent Progenitors in donor 2596', displayName: 'Multipotent Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-MPP-SRX1427790': { order: 13, description: 'Multipotent Progenitors in donor 4983', displayName: 'Multipotent Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-MPP-SRX1427802': { order: 14, description: 'Multipotent Progenitors in donor 6792', displayName: 'Multipotent Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-MPP-SRX1427856': { order: 15, description: 'Multipotent Progenitors in donor 7256', displayName: 'Multipotent Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-MPP-SRX1427857': { order: 16, description: 'Multipotent Progenitors in donor 7256', displayName: 'Multipotent Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-CMP-SRX1427823': { order: 17, description: 'Common Myeloid Progenitors in donor 2596', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-CMP-SRX1427824': { order: 18, description: 'Common Myeloid Progenitors in donor 2596', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-CMP-SRX1427792': { order: 19, description: 'Common Myeloid Progenitors in donor 4983', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-CMP-SRX1427793': { order: 20, description: 'Common Myeloid Progenitors in donor 4983', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-CMP-SRX1427804': { order: 21, description: 'Common Myeloid Progenitors in donor 6792', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-CMP-SRX1427805': { order: 22, description: 'Common Myeloid Progenitors in donor 6792', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-CMP-SRX1427859': { order: 23, description: 'Common Myeloid Progenitors in donor 7256', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-CMP-SRX1427860': { order: 24, description: 'Common Myeloid Progenitors in donor 7256', displayName: 'Common Myeloid Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-MEP-SRX1427831': { order: 25, description: 'Megakaryocyte Erythroid Progenitor in donor 2596', displayName: 'Megakaryocyte Erythroid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-MEP-SRX1427796': { order: 26, description: 'Megakaryocyte Erythroid Progenitor in donor 4983', displayName: 'Megakaryocyte Erythroid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-MEP-SRX1427797': { order: 27, description: 'Megakaryocyte Erythroid Progenitor in donor 4983', displayName: 'Megakaryocyte Erythroid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-MEP-SRX1427808': { order: 28, description: 'Megakaryocyte Erythroid Progenitor in donor 6792', displayName: 'Megakaryocyte Erythroid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-MEP-SRX1427809': { order: 29, description: 'Megakaryocyte Erythroid Progenitor in donor 6792', displayName: 'Megakaryocyte Erythroid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-MEP-SRX1427863': { order: 30, description: 'Megakaryocyte Erythroid Progenitor in donor 7256', displayName: 'Megakaryocyte Erythroid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-MEP-SRX1427864': { order: 31, description: 'Megakaryocyte Erythroid Progenitor in donor 7256', displayName: 'Megakaryocyte Erythroid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-Ery-SRX1427825': { order: 32, description: 'Erythroblast in donor 2596', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '2596-Ery-SRX1427826': { order: 33, description: 'Erythroblast in donor 2596', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '2596-Ery-SRX1427827': { order: 34, description: 'Erythroblast in donor 2596', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '5483-Ery-SRX1427846': { order: 35, description: 'Erythroblast in donor 5483', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '5483-Ery-SRX1427847': { order: 36, description: 'Erythroblast in donor 5483', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '5483-Ery-SRX1427848': { order: 37, description: 'Erythroblast in donor 5483', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '6926-Ery-SRX1427852': { order: 38, description: 'Erythroblast in donor 6926', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '6926-Ery-SRX1427853': { order: 39, description: 'Erythroblast in donor 6926', displayName: 'Erythroblast', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '2596-GMP-SRX1427828': { order: 40, description: 'Granulocyte-Monocyte Progenitors in donor 2596', displayName: 'Granulocyte-Monocyte Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-GMP-SRX1427794': { order: 41, description: 'Granulocyte-Monocyte Progenitors in donor 4983', displayName: 'Granulocyte-Monocyte Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-GMP-SRX1427795': { order: 42, description: 'Granulocyte-Monocyte Progenitors in donor 4983', displayName: 'Granulocyte-Monocyte Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-GMP-SRX1427806': { order: 43, description: 'Granulocyte-Monocyte Progenitors in donor 6792', displayName: 'Granulocyte-Monocyte Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-GMP-SRX1427807': { order: 44, description: 'Granulocyte-Monocyte Progenitors in donor 6792', displayName: 'Granulocyte-Monocyte Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-GMP-SRX1427861': { order: 45, description: 'Granulocyte-Monocyte Progenitors in donor 7256', displayName: 'Granulocyte-Monocyte Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-GMP-SRX1427862': { order: 46, description: 'Granulocyte-Monocyte Progenitors in donor 7256', displayName: 'Granulocyte-Monocyte Progenitors', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '4983-Mono-SRX1427798': { order: 47, description: 'Monocytes in donor 4983', displayName: 'Monocytes', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '4983-Mono-SRX1427799': { order: 48, description: 'Monocytes in donor 4983', displayName: 'Monocytes', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '6792-Mono-SRX1427810': { order: 49, description: 'Monocytes in donor 6792', displayName: 'Monocytes', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '6792-Mono-SRX1427811': { order: 50, description: 'Monocytes in donor 6792', displayName: 'Monocytes', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '7256-Mono-SRX1427865': { order: 51, description: 'Monocytes in donor 7256', displayName: 'Monocytes', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '7256-Mono-SRX1427866': { order: 52, description: 'Monocytes in donor 7256', displayName: 'Monocytes', group: 'Myeloid', study: 'Corces et al', pmid: '27526324' },
  '1001-Monocytes-U': { order: 53, description: 'Monocytes in donor 1001', displayName: 'Monocyte', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Monocytes-U': { order: 54, description: 'Monocytes in donor 1002', displayName: 'Monocyte', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Monocytes-U': { order: 55, description: 'Monocytes in donor 1003', displayName: 'Monocyte ', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Monocytes-S': { order: 56, description: 'Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1001', displayName: 'Monocyte (stimulated)', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Monocytes-S': { order: 57, description: 'Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1002', displayName: 'Monocyte (stimulated)', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Monocytes-S': { order: 58, description: 'Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1003', displayName: 'Monocyte (stimulated)', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Monocytes-S': { order: 59, description: 'Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1004', displayName: 'Monocyte (stimulated)', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1008-Monocytes-S': { order: 60, description: 'Monocytes, stimulated with 1 µg/ml LPS for 24 hours, in donor 1008', displayName: 'Monocyte (stimulated)', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1010-Monocytes-S': { order: 61, description: 'Monocytes, stimulated with 1 µg/ml LPS for 24 hours, in donor 1010', displayName: 'Monocyte (stimulated)', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Myeloid_DCs-U': { order: 62, description: 'Myeloid Dendritic cells in donor 1001', displayName: 'Myeloid dendritic cells', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Myeloid_DCs-U': { order: 63, description: 'Myeloid Dendritic cells in donor 1002', displayName: 'Myeloid dendritic cells', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1008-Myeloid_DCs-U': { order: 64, description: 'Myeloid Dendritic cells in donor 1008', displayName: 'Myeloid dendritic cells', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1001-pDCs-U': { order: 65, description: 'Plasmacytoid dendritic cells in donor 1001', displayName: 'Plasmacytoid dendritic cells', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1002-pDCs-U': { order: 66, description: 'Plasmacytoid dendritic cells in donor 1002', displayName: 'Plasmacytoid dendritic cells', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '1008-pDCs-U': { order: 67, description: 'Plasmacytoid dendritic cells in donor 1008', displayName: 'Plasmacytoid dendritic cells', group: 'Myeloid', study: 'Calderon et al', pmid: '31570894' },
  '4983-LMPP-SRX1427791': { order: 68, description: 'Lymphocyte-Primed Multipotent Progenitor in donor 4983', displayName: 'Lymphocyte-Primed Multipotent Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6792-LMPP-SRX1427803': { order: 69, description: 'Lymphocyte-Primed Multipotent Progenitor in donor 6792', displayName: 'Lymphocyte-Primed Multipotent Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '7256-LMPP-SRX1427858': { order: 70, description: 'Lymphocyte-Primed Multipotent Progenitor in donor 7256', displayName: 'Lymphocyte-Primed Multipotent Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-CLP-SRX1427821': { order: 71, description: 'Common Lymphoid Progenitor in donor 2596', displayName: 'Common Lymphoid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '2596-CLP-SRX1427822': { order: 72, description: 'Common Lymphoid Progenitor in donor 2596', displayName: 'Common Lymphoid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '5483-CLP-SRX1427845': { order: 73, description: 'Common Lymphoid Progenitor in donor 5483', displayName: 'Common Lymphoid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6926-CLP-SRX1427851': { order: 74, description: 'Common Lymphoid Progenitor in donor 6926', displayName: 'Common Lymphoid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '6926-CLP-SRX1427868': { order: 75, description: 'Common Lymphoid Progenitor in donor 6926', displayName: 'Common Lymphoid Progenitor', group: 'Progenitors', study: 'Corces et al', pmid: '27526324' },
  '1022-Bcell-SRX1427815': { order: 76, description: 'B cell in donor 1022', displayName: 'B cell', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '4983-Bcell-SRX1427836': { order: 77, description: 'B cell in donor 4983', displayName: 'B cell', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-Bcell-SRX1427840': { order: 78, description: 'B cell in donor 5483', displayName: 'B cell', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-Bcell-SRX1427867': { order: 79, description: 'B cell in donor 5483', displayName: 'B cell', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '1001-Bulk_B-U': { order: 80, description: 'Bulk B cells in donor 1001', displayName: 'Bulk B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Bulk_B-U': { order: 81, description: 'Bulk B cells in donor 1002', displayName: 'Bulk B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Bulk_B-U': { order: 82, description: 'Bulk B cells in donor 1003', displayName: 'Bulk B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Bulk_B-U': { order: 83, description: 'Bulk B cells in donor 1004', displayName: 'Bulk B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Bulk_B-S': { order: 84, description: 'Bulk B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1001', displayName: 'Bulk B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Bulk_B-S': { order: 85, description: 'Bulk B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1002', displayName: 'Bulk B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Bulk_B-S': { order: 86, description: 'Bulk B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1003', displayName: 'Bulk B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Naive_B-U': { order: 87, description: 'Naïve B cells in donor 1001', displayName: 'Naïve B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Naive_B-U': { order: 88, description: 'Naïve B cells in donor 1002', displayName: 'Naïve B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Naive_B-U': { order: 89, description: 'Naïve B cells in donor 1003', displayName: 'Naïve B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Naive_B-U': { order: 90, description: 'Naïve B cells in donor 1004', displayName: 'Naïve B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Naive_B-S': { order: 91, description: 'Naïve B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1001', displayName: 'Naïve B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Naive_B-S': { order: 92, description: 'Naïve B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1002', displayName: 'Naïve B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Naive_B-S': { order: 93, description: 'Naïve B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1003', displayName: 'Naïve B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Mem_B-U': { order: 94, description: 'Memory B cells in donor 1001', displayName: 'Memory B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Mem_B-U': { order: 95, description: 'Memory B cells in donor 1002', displayName: 'Memory B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Mem_B-U': { order: 96, description: 'Memory B cells in donor 1003', displayName: 'Memory B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Mem_B-U': { order: 97, description: 'Memory B cells in donor 1004', displayName: 'Memory B cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Mem_B-S': { order: 98, description: 'Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1001', displayName: 'Memory B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Mem_B-S': { order: 99, description: 'Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1002', displayName: 'Memory B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Mem_B-S': { order: 100, description: 'Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1003', displayName: 'Memory B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1010-Mem_B-S': { order: 101, description: 'Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1010', displayName: 'Memory B cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Plasmablasts-U': { order: 102, description: 'Plasmablasts in donor 1001', displayName: 'Plasmablasts', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Plasmablasts-U': { order: 103, description: 'Plasmablasts in donor 1002', displayName: 'Plasmablasts', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1010-Plasmablasts-U': { order: 104, description: 'Plasmablasts in donor 1010', displayName: 'Plasmablasts', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1022-CD4Tcell-SRX1427816': { order: 105, description: 'CD4+ T cells in donor 1022', displayName: 'CD4+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '2596-CD4Tcell-SRX1427819': { order: 106, description: 'CD4+ T cells in donor 2596', displayName: 'CD4+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '4983-CD4Tcell-SRX1427837': { order: 107, description: 'CD4+ T cells in donor 4983', displayName: 'CD4+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-CD4Tcell-SRX1427841': { order: 108, description: 'CD4+ T cells in donor 5483', displayName: 'CD4+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-CD4Tcell-SRX1427842': { order: 109, description: 'CD4+ T cells in donor 5483', displayName: 'CD4+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '1001-Regulatory_T-U': { order: 110, description: 'Regulatory CD4+ T cells in donor 1001', displayName: 'Regulatory CD4+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Regulatory_T-U': { order: 111, description: 'Regulatory CD4+ T cells in donor 1002', displayName: 'Regulatory CD4+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Regulatory_T-U': { order: 112, description: 'Regulatory CD4+ T cells in donor 1003', displayName: 'Regulatory CD4+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Regulatory_T-U': { order: 113, description: 'Regulatory CD4+ T cells in donor 1004', displayName: 'Regulatory CD4+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Regulatory_T-S': { order: 114, description: 'Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Regulatory CD4+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Regulatory_T-S': { order: 115, description: 'Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Regulatory CD4+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Regulatory_T-S': { order: 116, description: 'Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Regulatory CD4+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Regulatory_T-S': { order: 117, description: 'Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Regulatory CD4+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Naive_Tregs-U': { order: 118, description: 'Naïve T regulatory cells in donor 1004', displayName: 'Naïve T regulatory cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1008-Naive_Tregs-U': { order: 119, description: 'Naïve T regulatory cells in donor 1008', displayName: 'Naïve T regulatory cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Naive_Tregs-S': { order: 120, description: 'Naïve T regulatory cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Naïve T regulatory cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1010-Naive_Tregs-S': { order: 121, description: 'Naïve T regulatory cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1010', displayName: 'Naïve T regulatory cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Memory_Tregs-U': { order: 122, description: 'Memory T regulatory cell in donor 1001', displayName: 'Memory T regulatory cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Memory_Tregs-U': { order: 123, description: 'Memory T regulatory cell in donor 1002', displayName: 'Memory T regulatory cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Memory_Tregs-U': { order: 124, description: 'Memory T regulatory cell in donor 1003', displayName: 'Memory T regulatory cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Memory_Tregs-U': { order: 125, description: 'Memory T regulatory cell in donor 1004', displayName: 'Memory T regulatory cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Memory_Tregs-S': { order: 126, description: 'Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Memory T regulatory cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Memory_Tregs-S': { order: 127, description: 'Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Memory T regulatory cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Memory_Tregs-S': { order: 128, description: 'Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Memory T regulatory cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Memory_Tregs-S': { order: 129, description: 'Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Memory T regulatory cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Effector_CD4pos_T-U': { order: 130, description: 'Effector CD4 T cell in donor 1001', displayName: 'Effector CD4 T cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Effector_CD4pos_T-U': { order: 131, description: 'Effector CD4 T cell in donor 1002', displayName: 'Effector CD4 T cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Effector_CD4pos_T-U': { order: 132, description: 'Effector CD4 T cell in donor 1003', displayName: 'Effector CD4 T cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Effector_CD4pos_T-U': { order: 133, description: 'Effector CD4 T cell in donor 1004', displayName: 'Effector CD4 T cell', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Effector_CD4pos_T-S': { order: 134, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Effector CD4 T cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Effector_CD4pos_T-S': { order: 135, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Effector CD4 T cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Effector_CD4pos_T-S': { order: 136, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Effector CD4 T cell (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Naive_Teffs-U': { order: 137, description: 'Naïve T effector cells in donor 1001', displayName: 'Naïve T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Naive_Teffs-U': { order: 138, description: 'Naïve T effector cells in donor 1002', displayName: 'Naïve T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Naive_Teffs-U': { order: 139, description: 'Naïve T effector cells in donor 1003', displayName: 'Naïve T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Naive_Teffs-U': { order: 140, description: 'Naïve T effector cells in donor 1004', displayName: 'Naïve T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Naive_Teffs-S': { order: 141, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Naïve T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Naive_Teffs-S': { order: 142, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Naïve T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Naive_Teffs-S': { order: 143, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Naïve T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Naive_Teffs-S': { order: 144, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Naïve T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1011-Naive_Teffs-S': { order: 145, description: 'Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1011', displayName: 'Naïve T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Memory_Teffs-U': { order: 146, description: 'Memory T effector cells in donor 1001', displayName: 'Memory T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Memory_Teffs-U': { order: 147, description: 'Memory T effector cells in donor 1002', displayName: 'Memory T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Memory_Teffs-U': { order: 148, description: 'Memory T effector cells in donor 1003', displayName: 'Memory T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Memory_Teffs-U': { order: 149, description: 'Memory T effector cells in donor 1004', displayName: 'Memory T effector cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Memory_Teffs-S': { order: 150, description: 'Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Memory T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Memory_Teffs-S': { order: 151, description: 'Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Memory T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Memory_Teffs-S': { order: 152, description: 'Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Memory T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Memory_Teffs-S': { order: 153, description: 'Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Memory T effector cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Th1_precursors-U': { order: 154, description: 'T helper 1 cell precursors in donor 1001', displayName: 'T helper 1 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Th1_precursors-U': { order: 155, description: 'T helper 1 cell precursors in donor 1002', displayName: 'T helper 1 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Th1_precursors-U': { order: 156, description: 'T helper 1 cell precursors in donor 1003', displayName: 'T helper 1 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Th1_precursors-U': { order: 157, description: 'T helper 1 cell precursors in donor 1004', displayName: 'T helper 1 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Th1_precursors-S': { order: 158, description: 'T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'T helper 1 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Th1_precursors-S': { order: 159, description: 'T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'T helper 1 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Th1_precursors-S': { order: 160, description: 'T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'T helper 1 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Th1_precursors-S': { order: 161, description: 'T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'T helper 1 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Th2_precursors-U': { order: 162, description: 'T helper 2 cell precursors in donor 1001', displayName: 'T helper 2 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Th2_precursors-U': { order: 163, description: 'T helper 2 cell precursors in donor 1002', displayName: 'T helper 2 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Th2_precursors-U': { order: 164, description: 'T helper 2 cell precursors in donor 1003', displayName: 'T helper 2 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Th2_precursors-U': { order: 165, description: 'T helper 2 cell precursors in donor 1004', displayName: 'T helper 2 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Th2_precursors-S': { order: 166, description: 'T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'T helper 2 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Th2_precursors-S': { order: 167, description: 'T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'T helper 2 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Th2_precursors-S': { order: 168, description: 'T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'T helper 2 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Th2_precursors-S': { order: 169, description: 'T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'T helper 2 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Th17_precursors-U': { order: 170, description: 'T helper 17 cell precursors in donor 1001', displayName: 'T helper 17 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Th17_precursors-U': { order: 171, description: 'T helper 17 cell precursors in donor 1002', displayName: 'T helper 17 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Th17_precursors-U': { order: 172, description: 'T helper 17 cell precursors in donor 1004', displayName: 'T helper 17 cell precursors', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Th17_precursors-S': { order: 173, description: 'T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'T helper 17 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Th17_precursors-S': { order: 174, description: 'T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'T helper 17 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Th17_precursors-S': { order: 175, description: 'T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'T helper 17 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Th17_precursors-S': { order: 176, description: 'T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'T helper 17 cell precursors (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Follicular_T_Helper-U': { order: 177, description: 'T follicular helper cells in donor 1001', displayName: 'T follicular helper cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Follicular_T_Helper-U': { order: 178, description: 'T follicular helper cells in donor 1002', displayName: 'T follicular helper cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Follicular_T_Helper-U': { order: 179, description: 'T follicular helper cells in donor 1003', displayName: 'T follicular helper cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Follicular_T_Helper-U': { order: 180, description: 'T follicular helper cells in donor 1004', displayName: 'T follicular helper cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1010-Follicular_T_Helper-U': { order: 181, description: 'T follicular helper cells in donor 1010', displayName: 'T follicular helper cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Follicular_T_Helper-S': { order: 182, description: 'T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'T follicular helper cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Follicular_T_Helper-S': { order: 183, description: 'T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'T follicular helper cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Follicular_T_Helper-S': { order: 184, description: 'T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'T follicular helper cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Follicular_T_Helper-S': { order: 185, description: 'T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'T follicular helper cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1022-CD8Tcell-SRX1427817': { order: 186, description: 'CD8+ T cells in donor 1022', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '2596-CD8Tcell-SRX1427820': { order: 187, description: 'CD8+ T cells in donor 2596', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '4983-CD8Tcell-SRX1427838': { order: 188, description: 'CD8+ T cells in donor 4983', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-CD8Tcell-SRX1427843': { order: 189, description: 'CD8+ T cells in donor 5483', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-CD8Tcell-SRX1427844': { order: 190, description: 'CD8+ T cells in donor 5483', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '1001-CD8pos_T-U': { order: 191, description: 'CD8+ T cells in donor 1001', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-CD8pos_T-U': { order: 192, description: 'CD8+ T cells in donor 1002', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-CD8pos_T-U': { order: 193, description: 'CD8+ T cells in donor 1003', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-CD8pos_T-U': { order: 194, description: 'CD8+ T cells in donor 1004', displayName: 'CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-CD8pos_T-S': { order: 195, description: 'CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-CD8pos_T-S': { order: 196, description: 'CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-CD8pos_T-S': { order: 197, description: 'CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Naive_CD8_T-U': { order: 198, description: 'Naïve CD8+ T cells in donor 1001', displayName: 'Naïve CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Naive_CD8_T-U': { order: 199, description: 'Naïve CD8+ T cells in donor 1002', displayName: 'Naïve CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Naive_CD8_T-U': { order: 200, description: 'Naïve CD8+ T cells in donor 1003', displayName: 'Naïve CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Naive_CD8_T-U': { order: 201, description: 'Naïve CD8+ T cells in donor 1004', displayName: 'Naïve CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Naive_CD8_T-S': { order: 202, description: 'Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Naïve CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Naive_CD8_T-S': { order: 203, description: 'Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Naïve CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Naive_CD8_T-S': { order: 204, description: 'Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Naïve CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Naive_CD8_T-S': { order: 205, description: 'Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Naïve CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Central_memory_CD8pos_T-U': { order: 206, description: 'Central memory CD8+ T cells in donor 1001', displayName: 'Central memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Central_memory_CD8pos_T-U': { order: 207, description: 'Central memory CD8+ T cells in donor 1002', displayName: 'Central memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Central_memory_CD8pos_T-U': { order: 208, description: 'Central memory CD8+ T cells in donor 1003', displayName: 'Central memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Central_memory_CD8pos_T-U': { order: 209, description: 'Central memory CD8+ T cells in donor 1004', displayName: 'Central memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Central_memory_CD8pos_T-S': { order: 210, description: 'Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Central memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Central_memory_CD8pos_T-S': { order: 211, description: 'Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Central memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Central_memory_CD8pos_T-S': { order: 212, description: 'Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Central memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Central_memory_CD8pos_T-S': { order: 213, description: 'Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Central memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Effector_memory_CD8pos_T-U': { order: 214, description: 'Effector memory CD8+ T cells in donor 1001', displayName: 'Effector memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Effector_memory_CD8pos_T-U': { order: 215, description: 'Effector memory CD8+ T cells in donor 1002', displayName: 'Effector memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Effector_memory_CD8pos_T-U': { order: 216, description: 'Effector memory CD8+ T cells in donor 1003', displayName: 'Effector memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Effector_memory_CD8pos_T-U': { order: 217, description: 'Effector memory CD8+ T cells in donor 1004', displayName: 'Effector memory CD8+ T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Effector_memory_CD8pos_T-S': { order: 218, description: 'Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001', displayName: 'Effector memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Effector_memory_CD8pos_T-S': { order: 219, description: 'Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Effector memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Effector_memory_CD8pos_T-S': { order: 220, description: 'Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Effector memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Effector_memory_CD8pos_T-S': { order: 221, description: 'Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Effector memory CD8+ T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Gamma_delta_T-U': { order: 222, description: 'Gamma delta T cells in donor 1001', displayName: 'Gamma delta T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Gamma_delta_T-U': { order: 223, description: 'Gamma delta T cells in donor 1002', displayName: 'Gamma delta T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Gamma_delta_T-U': { order: 224, description: 'Gamma delta T cells in donor 1003', displayName: 'Gamma delta T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Gamma_delta_T-U': { order: 225, description: 'Gamma delta T cells in donor 1004', displayName: 'Gamma delta T cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Gamma_delta_T-S': { order: 226, description: 'Gamma delta T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002', displayName: 'Gamma delta T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Gamma_delta_T-S': { order: 227, description: 'Gamma delta T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003', displayName: 'Gamma delta T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Gamma_delta_T-S': { order: 228, description: 'Gamma delta T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004', displayName: 'Gamma delta T cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1022-NKcell-SRX1427818': { order: 229, description: 'Natural Killer cells in donor 1022', displayName: 'Natural Killer cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '2596-NKcell-SRX1427834': { order: 230, description: 'Natural Killer cells in donor 2596', displayName: 'Natural Killer cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '2596-NKcell-SRX1427835': { order: 231, description: 'Natural Killer cells in donor 2596', displayName: 'Natural Killer cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '4983-NKcell-SRX1427839': { order: 232, description: 'Natural Killer cells in donor 4983', displayName: 'Natural Killer cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-NKcell-SRX1427849': { order: 233, description: 'Natural Killer cells in donor 5483', displayName: 'Natural Killer cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '5483-NKcell-SRX1427850': { order: 234, description: 'Natural Killer cells in donor 5483', displayName: 'Natural Killer cells', group: 'Lymphoid', study: 'Corces et al', pmid: '27526324' },
  '1001-Immature_NK-U': { order: 235, description: 'Immature Natural Killer cells in donor 1001', displayName: 'Immature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Immature_NK-U': { order: 236, description: 'Immature Natural Killer cells in donor 1002', displayName: 'Immature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Immature_NK-U': { order: 237, description: 'Immature Natural Killer cells in donor 1003', displayName: 'Immature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Immature_NK-U': { order: 238, description: 'Immature Natural Killer cells in donor 1004', displayName: 'Immature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1008-Immature_NK-U': { order: 239, description: 'Immature Natural Killer cells in donor 1008', displayName: 'Immature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Mature_NK-U': { order: 240, description: 'Mature Natural Killer cells in donor 1001', displayName: 'Mature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Mature_NK-U': { order: 241, description: 'Mature Natural Killer cells in donor 1003', displayName: 'Mature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Mature_NK-U': { order: 242, description: 'Mature Natural Killer cells in donor 1004', displayName: 'Mature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1008-Mature_NK-U': { order: 243, description: 'Mature Natural Killer cells in donor 1008', displayName: 'Mature Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Mature_NK-S': { order: 244, description: 'Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1001', displayName: 'Mature Natural Killer cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Mature_NK-S': { order: 245, description: 'Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1002', displayName: 'Mature Natural Killer cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Mature_NK-S': { order: 246, description: 'Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1003', displayName: 'Mature Natural Killer cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Mature_NK-S': { order: 247, description: 'Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1004', displayName: 'Mature Natural Killer cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1008-Mature_NK-S': { order: 248, description: 'Mature Natural Killer cells, stimulated with 200 U/ml IL-2 for 24 hours, in donor 1008', displayName: 'Mature Natural Killer cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1010-Mature_NK-S': { order: 249, description: 'Mature Natural Killer cells, stimulated with 200 U/ml IL-2 for 24 hours, in donor 1010', displayName: 'Mature Natural Killer cells (stimulated)', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1001-Memory_NK-U': { order: 250, description: 'Memory Natural Killer cells in donor 1001', displayName: 'Memory Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1002-Memory_NK-U': { order: 251, description: 'Memory Natural Killer cells in donor 1002', displayName: 'Memory Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1003-Memory_NK-U': { order: 252, description: 'Memory Natural Killer cells in donor 1003', displayName: 'Memory Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1004-Memory_NK-U': { order: 253, description: 'Memory Natural Killer cells in donor 1004', displayName: 'Memory Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1008-Memory_NK-U': { order: 254, description: 'Memory Natural Killer cells in donor 1008', displayName: 'Memory Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  '1010-Memory_NK-U': { order: 255, description: 'Memory Natural Killer cells in donor 1010', displayName: 'Memory Natural Killer cells', group: 'Lymphoid', study: 'Calderon et al', pmid: '31570894' },
  'SU048-pHSC-SRX1427875': { order: 256, description: 'Preleukemic Hematopoetic Stem Cells in donor SU04', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU070-pHSC-SRX1427879': { order: 257, description: 'Preleukemic Hematopoetic Stem Cells in donor SU07', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU070-pHSC-SRX1427880': { order: 258, description: 'Preleukemic Hematopoetic Stem Cells in donor SU07', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU209-pHSC-SRX1427883': { order: 259, description: 'Preleukemic Hematopoetic Stem Cells in donor SU20', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU209-pHSC-SRX1427884': { order: 260, description: 'Preleukemic Hematopoetic Stem Cells in donor SU20', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU209-pHSC-SRX1427885': { order: 261, description: 'Preleukemic Hematopoetic Stem Cells in donor SU20', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU306-pHSC-SRX1427887': { order: 262, description: 'Preleukemic Hematopoetic Stem Cells in donor SU30', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU336-pHSC-SRX1427889': { order: 263, description: 'Preleukemic Hematopoetic Stem Cells in donor SU33', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU351-pHSC-SRX1427891': { order: 264, description: 'Preleukemic Hematopoetic Stem Cells in donor SU35', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU353-pHSC-SRX1427894': { order: 265, description: 'Preleukemic Hematopoetic Stem Cells in donor SU35', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU444-pHSC-SRX1427897': { order: 266, description: 'Preleukemic Hematopoetic Stem Cells in donor SU44', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU484-pHSC-SRX1427899': { order: 267, description: 'Preleukemic Hematopoetic Stem Cells in donor SU48', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU496-pHSC-SRX1427902': { order: 268, description: 'Preleukemic Hematopoetic Stem Cells in donor SU49', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU501-pHSC-SRX1427904': { order: 269, description: 'Preleukemic Hematopoetic Stem Cells in donor SU50', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU575-pHSC-SRX1427907': { order: 270, description: 'Preleukemic Hematopoetic Stem Cells in donor SU57', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU583-pHSC-SRX1427910': { order: 271, description: 'Preleukemic Hematopoetic Stem Cells in donor SU58', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU583-pHSC-SRX1427911': { order: 272, description: 'Preleukemic Hematopoetic Stem Cells in donor SU58', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU623-pHSC-SRX1427915': { order: 273, description: 'Preleukemic Hematopoetic Stem Cells in donor SU62', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU654-pHSC-SRX1427918': { order: 274, description: 'Preleukemic Hematopoetic Stem Cells in donor SU65', displayName: 'Preleukemic Hematopoetic Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU070-LSC-SRX1427878': { order: 275, description: 'Leukemia Stem Cells in donor SU07', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU209-LSC-SRX1427882': { order: 276, description: 'Leukemia Stem Cells in donor SU20', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU353-LSC-SRX1427893': { order: 277, description: 'Leukemia Stem Cells in donor SU35', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU444-LSC-SRX1427896': { order: 278, description: 'Leukemia Stem Cells in donor SU44', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU496-LSC-SRX1427901': { order: 279, description: 'Leukemia Stem Cells in donor SU49', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU575-LSC-SRX1427906': { order: 280, description: 'Leukemia Stem Cells in donor SU57', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU583-LSC-SRX1427909': { order: 281, description: 'Leukemia Stem Cells in donor SU58', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU654-LSC-SRX1427917': { order: 282, description: 'Leukemia Stem Cells in donor SU65', displayName: 'Leukemia Stem Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU048-Blast-SRX1427869': { order: 283, description: 'Leukemic Blast Cells in donor SU04', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU048-Blast-SRX1427870': { order: 284, description: 'Leukemic Blast Cells in donor SU04', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU048-Blast-SRX1427871': { order: 285, description: 'Leukemic Blast Cells in donor SU04', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU048-Blast-SRX1427872': { order: 286, description: 'Leukemic Blast Cells in donor SU04', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU048-Blast-SRX1427873': { order: 287, description: 'Leukemic Blast Cells in donor SU04', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU048-Blast-SRX1427874': { order: 288, description: 'Leukemic Blast Cells in donor SU04', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU070-Blast-SRX1427876': { order: 289, description: 'Leukemic Blast Cells in donor SU07', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU070-Blast-SRX1427877': { order: 290, description: 'Leukemic Blast Cells in donor SU07', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU209-Blast-SRX1427881': { order: 291, description: 'Leukemic Blast Cells in donor SU20', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU306-Blast-SRX1427886': { order: 292, description: 'Leukemic Blast Cells in donor SU30', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU336-Blast-SRX1427888': { order: 293, description: 'Leukemic Blast Cells in donor SU33', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU351-Blast-SRX1427890': { order: 294, description: 'Leukemic Blast Cells in donor SU35', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU353-Blast-SRX1427892': { order: 295, description: 'Leukemic Blast Cells in donor SU35', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU444-Blast-SRX1427895': { order: 296, description: 'Leukemic Blast Cells in donor SU44', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU484-Blast-SRX1427898': { order: 297, description: 'Leukemic Blast Cells in donor SU48', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU496-Blast-SRX1427900': { order: 298, description: 'Leukemic Blast Cells in donor SU49', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU501-Blast-SRX1427903': { order: 299, description: 'Leukemic Blast Cells in donor SU50', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU575-Blast-SRX1427905': { order: 300, description: 'Leukemic Blast Cells in donor SU57', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU583-Blast-SRX1427908': { order: 301, description: 'Leukemic Blast Cells in donor SU58', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU623-Blast-SRX1427912': { order: 302, description: 'Leukemic Blast Cells in donor SU62', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU623-Blast-SRX1427913': { order: 303, description: 'Leukemic Blast Cells in donor SU62', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU623-Blast-SRX1427914': { order: 304, description: 'Leukemic Blast Cells in donor SU62', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
  'SU654-Blast-SRX1427916': { order: 305, description: 'Leukemic Blast Cells in donor SU65', displayName: 'Leukemic Blast Cells', group: 'Leukemic', study: 'Corces et al', pmid: '27526324' },
}
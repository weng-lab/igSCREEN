import { BigWigTrackProps, DefaultBigWig, DisplayMode, TrackType } from "@weng-lab/genomebrowser";

const HEIGHT = 75

export const tracks = {
  "B Cells": {
    "ATAC": [
      {
        ...DefaultBigWig,
        id: "ATAC_Bcells_merged_signal",
        title: "ATAC B Cells Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/ATAC_Bcells_merged_signal.bigWig",
        color: "#0000ff",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ],
    "DNase": [
      {
        ...DefaultBigWig,
        id: "DNase_Bcells_merged_signal",
        title: "DNase B Cells Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/DNase_Bcells_merged_signal.bigWig",
        color: "#0000ff",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ]
  },
  "CD4 T Cells": {
    "ATAC": [
      {
        ...DefaultBigWig,
        id: "ATAC_CD4_Tcells_merged_signal",
        title: "ATAC CD4 T Cells Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/ATAC_CD4_Tcells_merged_signal.bigWig",
        color: "#980000",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ],
    "DNase": [
      {
        ...DefaultBigWig,
        id: "DNase_CD4_Tcells_merged_signal",
        title: "DNase CD4 T Cells Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/DNase_CD4_Tcells_merged_signal.bigWig",
        color: "#980000",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ]
  },
  "Erythroblasts": {
    "ATAC": [
      {
        ...DefaultBigWig,
        id: "ATAC_Erythroblasts_merged_signal",
        title: "ATAC Erythroblasts Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/ATAC_Erythroblasts_merged_signal.bigWig",
        color: "#684fda",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ],
    "DNase": [
      {
        ...DefaultBigWig,
        id: "DNase_Erythroblasts_merged_signal",
        title: "DNase Erythroblasts Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/DNase_Erythroblasts_merged_signal.bigWig",
        color: "#684fda",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ]
  },
  "Myeloid": {
    "ATAC": [
      {
        ...DefaultBigWig,
        id: "ATAC_Myeloid_merged_signal",
        title: "ATAC Myeloid Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/ATAC_Myeloid_merged_signal.bigWig",
        color: "#9900ff",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,  
      }
    ],
    "DNase": [
      {
        ...DefaultBigWig,
        id: "DNase_Myeloid_merged_signal",
        title: "DNase Myeloid Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/DNase_Myeloid_merged_signal.bigWig",
        color: "#9900ff",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ]
  },
  "NK": {
    "ATAC": [
      {
        ...DefaultBigWig,
        id: "ATAC_NK_merged_signal",
        title: "ATAC NK Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/ATAC_NK_merged_signal.bigWig",
        color: "#38761d",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ],
    "DNase": [
      { 
        ...DefaultBigWig,
        id: "DNase_NK_merged_signal",
        title: "DNase NK Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/DNase_NK_merged_signal.bigWig",
        color: "#38761d",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ]
  },
  "Progenitors": {
    "ATAC": [
      {
        ...DefaultBigWig,
        id: "ATAC_Progenitors_merged_signal",
        title: "ATAC Progenitors Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/ATAC_Progenitors_merged_signal.bigWig",
        color: "#666666",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ],
    "DNase": [
      {
        ...DefaultBigWig,
        id: "DNase_Progenitors_merged_signal",
        title: "DNase Progenitors Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/DNase_Progenitors_merged_signal.bigWig",
        color: "#666666",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      } 
    ]
  },
  "GD T Cells": {
    "ATAC": [
      {
        ...DefaultBigWig,
        id: "ATAC_gd_Tcells_merged_signal",
        title: "ATAC GD T Cells Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/ATAC_gd_Tcells_merged_signal.bigWig",
        color: "#fa0056",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ],
    "DNase": null
  },
  "Bulk T Cells": {
    "ATAC": null,
    "DNase": [
      {
        ...DefaultBigWig,
        id: "DNase_Bulk_Tcells_merged_signal",
        title: "DNase Bulk T Cells Merged Signal",
        url: "https://downloads.wenglab.org/igscreen/DNase_Bulk_Tcells_merged_signal.bigWig",
        color: "#ff0000",
        height: HEIGHT,
        displayMode: DisplayMode.FULL,
      }
    ]
  }
}








'use client'
import * as React from "react"
import CellTypeTree from "../../common/components/cellTypeTree"
import { useEffect, useMemo, useState } from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box, Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import { QueryResult, gql, useQuery } from "@apollo/client";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
import { client } from "../../common/utils";
import UpSetPlot from "./UpSetPlot";
import {v4 as uuidv4} from 'uuid'

/**
 * @todo add hover info on cells (how many cCREs active)
 * @todo add error handling when more than 5 cell types selected
 */


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
    readonly unstimulated: {Calderon?: string | string[], Corces?: string | string[]};
    readonly stimulated?: {Calderon: string | string[]}
  }
}

export interface CellTypes {
  //Calderon
  // Monocytes: CellTypeInfo,
  Myeloid_DCs: CellTypeInfo,
  pDCs: CellTypeInfo,
  // Bulk_B: CellTypeInfo,
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
  //Corces
  // CD34_Cord_Blood: CellTypeInfo, //Hematopoetic Stem Cell - How do I handle three versions of same node on tree? Excluded for now
  // CD34_Bone_Marrow: CellTypeInfo, //Hematopoetic Stem Cell
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
  //Shared
  Monocytes: CellTypeInfo, //Using Calderon "name". Also using Calderon's Stimulated/Unstimulated. In Corces it is "Mono", and no stimulation info
  Bulk_B: CellTypeInfo, //Using Calderon "name". Also using Calderon's Stimulated/Unstimulated. In Corces it is "Bcell", and no stimulation info
  CD8pos_T: CellTypeInfo, //Using Calderon "name". Also using Calderon's Stimulated/Unstimulated. In Corces it is "CD8Tcell", and no stimulation info
}

//Initial configuration of the cell type tree
//To break displayName into multiple lines, use '/'
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
      unstimulated: {Calderon: 'Monocytes-U', Corces: 'Mono'},
      stimulated: {Calderon: 'Monocytes-S'}
    },
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
      unstimulated: {Calderon: "Myeloid_DCs-U"}
    },
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
      unstimulated: {Calderon: 'pDCs-U'}
    },
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
      unstimulated: {Calderon: 'Bulk_B-U', Corces: "Bcell"},
      stimulated: {Calderon: 'Bulk_B-S'}
    },
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
      unstimulated: {Calderon: 'Naive_B-U'},
      stimulated: {Calderon: 'Naive_B-S'}
    },
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
      unstimulated: {Calderon: 'Mem_B-U'},
      stimulated: {Calderon: 'Mem_B-S'}
    },
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
      unstimulated: {Calderon: 'Plasmablasts-U'}
    },
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
      unstimulated: {Calderon: 'Regulatory_T-U'},
      stimulated: {Calderon: 'Regulatory_T-S'}
    },
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
      unstimulated: {Calderon: 'Naive_Tregs-U'},
      stimulated: {Calderon: 'Naive_Tregs-S'}
    },
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
      unstimulated: {Calderon: 'Memory_Tregs-U'},
      stimulated: {Calderon: 'Memory_Tregs-S'}
    },
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
      unstimulated: {Calderon: 'Effector_CD4pos_T-U'},
      stimulated: {Calderon: 'Effector_CD4pos_T-S'}
    },
  },
  Naive_Teffs: {
    id: 'Naive_Teffs',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Naïve T/effector cell",
    unstimImagePath: '/cellTypes/Naive_teffs-U.png',
    stimImagePath: '/cellTypes/Naive_teffs-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: {Calderon: 'Naive_Teffs-U'},
      stimulated: {Calderon: 'Naive_Teffs-S'}
    },
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
      unstimulated: {Calderon: 'Memory_Teffs-U'},
      stimulated: {Calderon: 'Memory_Teffs-S'}
    },
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
      unstimulated: {Calderon: 'Th1_precursors-U'},
      stimulated: {Calderon: 'Th1_precursors-S'}
    },
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
      unstimulated: {Calderon: 'Th2_precursors-U'},
      stimulated: {Calderon: 'Th2_precursors-S'}
    },
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
      unstimulated: {Calderon: 'Th17_precursors-U'},
      stimulated: {Calderon: 'Th17_precursors-S'}
    },
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
      unstimulated: {Calderon: 'Follicular_T_Helper-U'},
      stimulated: {Calderon: 'Follicular_T_Helper-S'}
    },
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
      unstimulated: {Calderon: 'CD8pos_T-U', Corces: "CD8Tcell"},
      stimulated: {Calderon: 'CD8pos_T-S'}
    },
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
      unstimulated: {Calderon: 'Naive_CD8_T-U'},
      stimulated: {Calderon: 'Naive_CD8_T-S'}
    },
  },
  Central_memory_CD8pos_T: {
    id: 'Central_memory_CD8pos_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Central/memory/CD8+ T cell",
    unstimImagePath: '/cellTypes/Central_Memory_CD8pos_T-U.png',
    stimImagePath: '/cellTypes/Central_Memory_CD8pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: {Calderon: 'Central_memory_CD8pos_T-U'},
      stimulated: {Calderon: 'Central_memory_CD8pos_T-S'}
    },
  },
  Effector_memory_CD8pos_T: {
    id: 'Effector_memory_CD8pos_T',
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Effector/memory/CD8+ T cell",
    unstimImagePath: '/cellTypes/Effector_memory_CD8pos_T-U.png',
    stimImagePath: '/cellTypes/Effector_memory_CD8pos_T-S.png',
    stimulable: true,
    queryValues: {
      unstimulated: {Calderon: 'Effector_memory_CD8pos_T-U'},
      stimulated: {Calderon: 'Effector_memory_CD8pos_T-S'}
    },
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
      unstimulated: {Calderon: 'Gamma_delta_T-U'},
      stimulated: {Calderon: 'Gamma_delta_T-S'}
    },
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
      unstimulated: {Calderon: 'Immature_NK-U'}
    },
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
      unstimulated: {Calderon: 'Mature_NK-U'},
      stimulated: {Calderon: 'Mature_NK-S'}
    },
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
      unstimulated: {Calderon: 'Memory_NK-U'}
    },
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
      unstimulated: {Corces: ["HSC", "CD34_Cord_Blood", "CD34_Bone_Marrow"]}
    },
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
      unstimulated: {Corces: "MPP"}
    },
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
      unstimulated: {Corces: "CMP"}
    },
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
      unstimulated: {Corces: "MEP"}
    },
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
      unstimulated: {Corces: "Ery"}
    },
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
      unstimulated: {Corces: "GMP"}
    },
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
      unstimulated: {Corces: "LMPP"}
    },
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
      unstimulated: {Corces: "CLP"}
    },
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
      unstimulated: {Corces: "CD4Tcell"}
    },
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
      unstimulated: {Corces: "NKcell"}
    },
  }
}

const ICRE_COUNT = gql(`
  query iCRECount(
    $unionCellTypes: [[String!]]
    $intersectCellTypes: [[String!]]
    $excludeCellTypes: [[String!]]
  ) {
    iCREsCountQuery(
      celltypes: $unionCellTypes
      allcelltypes: $intersectCellTypes
      excludecelltypes: $excludeCellTypes
    )
  }
`)

const GET_FILE = gql(`
  query iCRECount(
    $unionCellTypes: [[String!]]
    $intersectCellTypes: [[String!]]
    $excludeCellTypes: [[String!]]
  ) {
    iCREsCountQuery(
      celltypes: $unionCellTypes
      allcelltypes: $intersectCellTypes
      excludecelltypes: $excludeCellTypes
    )
  }
`)

//So I need the same info as the other query, add UUID, and just with a different query name.
//Maybe I should generate the insides of every query, store that, and then use the inside to populate each query.
//Need way to match each node with it's query to handle the onClick()

interface cCRECellTypeData {
  celltypes: string[];
  accession: string;
  coordinates: {
    start: number;
    end: number;
    chromosome: string;
  };
  group: string;
  rdhs: string;
}

interface QueryGroup {
  intersect?: string[][],
  exclude?: string[][],
  union?: string[],
  name: string
}

export default function Downloads({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [cellTypeState, setCellTypeState] = useState<CellTypes>(cellTypeInitialState)
  const [stimulateMode, setStimulateMode] = useState<boolean>(false)
  const [cursor, setCursor] = useState<'auto' | 'pointer' | 'cell' | 'not-allowed'>('auto')
  const [cellsToFetch, setCellsToFetch] = useState<CellTypeInfo[]>([])
  //Used to store groupings needed to generate files when clicking on a bar in UpSet plot
  const [upSetQueryGroups, setUpSetQueryGroups] = useState<{ [key: string]: QueryGroup }>(null)

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
      //is this working correctly? Shouldn't be used probably
      case "B": return Object.values(cell.queryValues.unstimulated).flat().concat((Object.values(cell.queryValues.stimulated).flat()))
    }
  }

  /**
   * 
   * @param cellsToFetch
   * @returns gql query for UpSet plot
   */
  const generateQuery = (cellsToFetch: CellTypeInfo[]) => {
    //Out of cellsToFetch extract relevant information, and create two entries for cells with "B" stimulation to iterate through more easily later
    let cells: {displayName: string, queryVals: string[]}[] = [];
    //This order
    cellsToFetch.forEach(cell => {
      if (cell.stimulated == "B") {
        cells.push({displayName: cell.id.replace('-', '_') + '_U', queryVals: extractQueryValues(cell, "U")})
        cells.push({displayName: cell.id.replace('-', '_') + '_S', queryVals: extractQueryValues(cell, "S")})
      } else cells.push({displayName: cell.id.replace('-', '_'), queryVals: extractQueryValues(cell, cell.stimulated)})
    })
    let queryGroups: QueryGroup[] = []
    
    //Union of all cells
    if (cellsToFetch.length > 0) {
      queryGroups.push({union: cellsToFetch.map(cell => extractQueryValues(cell, cell.stimulated)).flat(2), name: 'Union_All'})
    }

    cells.forEach((cell, i) => {
      queryGroups.push({union: cell.queryVals, name: '_' + i.toString() + cell.displayName})
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
    for (let i = 1; i < (2 ** n); i++){
      binaryStrings.push(i.toString(2).padStart(n, '0')) //Create array of binary strings
    }

    //For each binary string, assign each cell to be intersected or excluded based on 1/0 in string
    binaryStrings.forEach((str) => {
      let grouping: QueryGroup = {intersect: [], exclude: [], name: `UpSet_${str}`}
      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === '1') {
          grouping.intersect.push(cells[i].queryVals)
        } else grouping.exclude.push(cells[i].queryVals)
      }
      queryGroups.push(grouping)
    })

    // Store query groups used to generate plot
    setUpSetQueryGroups(Object.fromEntries(queryGroups.map(group => [group.name, group])))

    const iCREQuery = `{
      ${queryGroups.map(group => `${group.name}: iCREsCountQuery(
        ${generateQueryBody(group)}
      )`).join('\n\n')}
    }`

    //Join query strings and parse into query document
    console.log(iCREQuery)
    return (gql(iCREQuery))
  }

  /**
   * 
   * @param queryGroup
   * @param uuid needed if using query for createicresFilesQuery
   * @returns inside part of query to be used in iCREsCountQuery or createicresFilesQuery
   */
  const generateQueryBody = (queryGroup: QueryGroup, uuid?: string): string => {
    if (queryGroup.union) {
      return (
        //All passed as one nested array to get union of all
        `celltypes: [[\"${queryGroup.union.join('\", \"')}\"]]`
        + `${uuid ?? ''}`
      )
    } else if (queryGroup.intersect && !queryGroup.union) {
      return (
        `celltypes: [${queryGroup.intersect.map((vals: string[]) => `["${vals.join('", "')}"]`).join(', ')}]`
        + `${queryGroup?.exclude.length > 0 ? `\nexcludecelltypes: [${queryGroup.exclude.map((vals: string[]) => `["${vals.join('", "')}"]`).join(', ')}]` : '' }`
        + `${uuid ?? ''}`
      )
    } else if ((!queryGroup.intersect && !queryGroup.union) || (queryGroup.intersect && queryGroup.union)) {
      throw new Error("Something went wrong generating query groups")
    }
  }

  const QUERY = useMemo(() => {
    if (cellsToFetch.length > 0) {
      return (
        generateQuery(cellsToFetch)
      )
    } 
    else return (
      gql`
      query count{
        iCREsCountQuery(
          celltypes: [[]]
        )
      }
      `
    )
  }, [cellsToFetch])

  const { data: data_count, loading: loading_count, error: error_count, refetch } = useQuery(
    QUERY,
    {
      client,
      skip: cellsToFetch?.length === 0
    }
  )

  /**
   * 
   * @param data return data from gql
   * @returns 
   */
  const transformtoUpSet = (data: {[key: string]: number}): { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] } => {
    let returnData: { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] } = { intersections: [], counts: [], order: [] }

    Object.entries(data).forEach((x: [string, number]) => {
      if (x[0] === "Union_All") {
        //Do something if putting donwload all in UpSet plot
      } else if (x[0].charAt(0) === "_") { //If character is '_' it's the query for individual counts
        returnData.counts.push({name: x[0].slice(2), count: x[1]}) //push cell name stripped of number and counts
        returnData.order.push(x[0].slice(1)) //For order, push cell stripped of leading underscore. Keep number for sorting
      } else if (x[0].includes("UpSet_")){
        returnData.intersections.push({name: x[0].slice(6), count: x[1]})
      } else throw new Error("Error parsing gql return data to UpSet data")
    })
    
    returnData.order = returnData.order.sort((a, b) => +a.charAt[0] - +b.charAt[0]).map(x => x.slice(1)) //sort returnData.order based on leading number, then strip leading numbers

    console.log(returnData)
    return (
      returnData
    )
  }

  //Triggered when button pressed, filter cellTypeState and mark to fetch
  const handleFetch = () => {
    setCellsToFetch(Object.values(cellTypeState).filter((x: CellTypeInfo) => x.selected))
  }

  useEffect(() => {
    if (cellsToFetch?.length > 0) refetch();
  }, [cellsToFetch, refetch])


  //Wrap in useMemo to stop rerender of tree when cursor changes here
  const cellTypeTree = useMemo(() => {
    return (
      <CellTypeTree
        width={900}
        height={1100}
        orientation="vertical"
        cellTypeState={cellTypeState}
        setCellTypeState={setCellTypeState}
        stimulateMode={stimulateMode}
        setStimulateMode={setStimulateMode}
        setCursor={setCursor}
      />
    )
  }, [cellTypeState, setCellTypeState, stimulateMode, setCursor])

  const upSet = useMemo(() => {
    if (data_count) {return( <UpSetPlot
    key={data_count}
    width={700}
    height={500}
    data={transformtoUpSet(data_count)}
    setCursor={setCursor}
    events={true}
  />)} else return <></>
  }, [data_count])



  const handleStimulateAll = (mode: "U" | "S" | "B") => {
    let newObj = { ...cellTypeState }
    for (let cellName in newObj) {
      newObj[cellName].stimulable && (newObj[cellName].stimulated = mode)
    }
    setCellTypeState(newObj)
  }

  const handleSelectAll = (x: boolean) => {
    let newObj = { ...cellTypeState }
    for (let cellName in newObj) {
      newObj[cellName].selectable && (newObj[cellName].selected = x)
    }
    setCellTypeState(newObj)
  }

  const handleToggleStimulateMode = () => {
    setStimulateMode(!stimulateMode)
    setCursor(!stimulateMode ? 'cell' : 'auto')
  }

  return (
    <Grid2 container mt={3} spacing={2} sx={{ cursor }} >
      <Grid2 xs={12} lg={7} zIndex={10}>
        {cellTypeTree}
      </Grid2>
      <Grid2 xs={12} lg={5}>
        <Tooltip title="Note: Not all cells are stimulable">
          <Button variant="outlined" onClick={() => handleStimulateAll("S")}>Stimulate All</Button>
        </Tooltip>
        <Button variant="outlined" onClick={() => handleStimulateAll("U")}>Unstimulate All</Button>
        <Tooltip title="Tip: Holding Option/Command (MacOS) or Alt/Windows (Windows) will enter stimulate mode">
          <Button variant="outlined" onClick={handleToggleStimulateMode}>{stimulateMode ? 'Exit Stimulate Mode' : 'Enter Stimulate Mode'}</Button>
        </Tooltip>
        <Tooltip title="Note: Not all cells are selectable">
          <Button variant="outlined" onClick={() => handleSelectAll(true)}>Select All</Button>
        </Tooltip>
        <Button variant="outlined" onClick={() => handleSelectAll(false)}>Unselect All</Button>
        <Button variant="outlined" onClick={handleFetch}>Generate UpSet</Button>
        {loading_count && <CircularProgress />}
        <Box mt={2}>
        {upSet}
        </Box>
      </Grid2>
    </Grid2>
  )
}

'use client'
import * as React from "react"
import CellTypeTree from "../../common/components/cellTypeTree"
import { useEffect, useMemo, useState } from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import { QueryResult, gql, useQuery } from "@apollo/client";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
import { client } from "../../common/utils";

/**
 * @todo add hover info on cells (how many cCREs active)
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
    readonly unstimulated: string;
    readonly stimulated?: string;
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
      unstimulated: 'Monocytes-U',
      stimulated: 'Monocytes-S'
      //IN Corces is "Mono"
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
      unstimulated: 'Myeloid_DCs-U'
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
      unstimulated: 'pDCs-U'
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
      unstimulated: 'Bulk_B-U',
      stimulated: 'Bulk_B-S'
      //In Corces is "Bcell"
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
      unstimulated: 'Naive_B-U',
      stimulated: 'Naive_B-S'
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
      unstimulated: 'Mem_B-U',
      stimulated: 'Mem_B-S'
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
      unstimulated: 'Plasmablasts-U'
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
      unstimulated: 'Regulatory_T-U',
      stimulated: 'Regulatory_T-S'
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
      unstimulated: 'Naive_Tregs-U',
      stimulated: 'Naive_Tregs-S'
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
      unstimulated: 'Memory_Tregs-U',
      stimulated: 'Memory_Tregs-S'
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
      unstimulated: 'Effector_CD4pos_T-U',
      stimulated: 'Effector_CD4pos_T-S'
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
      unstimulated: 'Naive_Teffs-U',
      stimulated: 'Naive_Teffs-S'
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
      unstimulated: 'Memory_Teffs-U',
      stimulated: 'Memory_Teffs-S'
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
      unstimulated: 'Th1_precursors-U',
      stimulated: 'Th1_precursors-S'
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
      unstimulated: 'Th2_precursors-U',
      stimulated: 'Th2_precursors-S'
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
      unstimulated: 'Th17_precursors-U',
      stimulated: 'Th17_precursors-S'
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
      unstimulated: 'Follicular_T_Helper-U',
      stimulated: 'Follicular_T_Helper-S'
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
      unstimulated: 'CD8pos_T-U',
      stimulated: 'CD8pos_T-S'
      //In Corces is "CD8Tcell"
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
      unstimulated: 'Naive_CD8_T-U',
      stimulated: 'Naive_CD8_T-S'
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
      unstimulated: 'Central_memory_CD8pos_T-U',
      stimulated: 'Central_memory_CD8pos_T-S'
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
      unstimulated: 'Effector_memory_CD8pos_T-U',
      stimulated: 'Effector_memory_CD8pos_T-S'
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
      unstimulated: 'Gamma_delta_T-U',
      stimulated: 'Gamma_delta_T-S'
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
      unstimulated: 'Immature_NK-U'
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
      unstimulated: 'Mature_NK-U',
      stimulated: 'Mature_NK-S'
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
      unstimulated: 'Memory_NK-U'
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
      unstimulated: "HSC"
    },
  },
  MPP: {
    id: "MPP",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "Multipotent/progenitor",
    unstimImagePath: '/cellTypes/HSC.png',
    stimulable: false,
    queryValues: {
      unstimulated: "MPP"
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
      unstimulated: "CMP"
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
      unstimulated: "MEP"
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
      unstimulated: "Ery"
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
      unstimulated: "GMP"
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
      unstimulated: "LPMP"
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
      unstimulated: "CLP"
    },
  },
  CD4Tcell: {
    id: "CD4Tcell",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "CD4+ T cell",
    unstimImagePath: '/cellTypes/Missing.png',
    stimulable: false,
    queryValues: {
      unstimulated: "CD4Tcell"
    },
  },
  Nkcell: {
    id: "Nkcell",
    selected: false,
    stimulated: "U",
    selectable: true,
    displayName: "NK cell",
    unstimImagePath: '/cellTypes/Missing.png',
    stimulable: false,
    queryValues: {
      unstimulated: "Nkcell"
    },
  }
}

const ICRE_QUERY = gql(`
  query icrQuery($celltypes:[String!]){
    iCREQuery(celltypes:$celltypes) {
      celltypes
      accession
      coordinates {
        start
        end
        chromosome
      }
      group
      rdhs
    }
  }
`)

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

export default function Downloads({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [cellTypeState, setCellTypeState] = useState<CellTypes>(cellTypeInitialState)
  const [stimulateMode, setStimulateMode] = useState<boolean>(false)
  const [cursor, setCursor] = useState<'auto' | 'pointer' | 'cell' | 'not-allowed'>('auto')
  const [toFetch, setToFetch] = useState<string[]>(null)

  const extractCellNames = () => {
    return (
      Object.values(cellTypeState)
        .filter((cellType: CellTypeInfo) => cellType.selected)
        .flatMap((cellType: CellTypeInfo) => {
          switch (cellType.stimulated) {
            case "U": return [cellType.queryValues.unstimulated]
            case "S": return [cellType.queryValues.stimulated]
            case "B": return [cellType.queryValues.unstimulated, cellType.queryValues.stimulated]
            default: return []
          }
        })
    )
  }

  //Need to properly type the variable used and return data
  const { data: data_cellTypeSpecific, loading: loading_cellTypeSpecific, error: error_cellTypeSpecific, refetch } = useQuery(
    ICRE_QUERY,
    {
      variables: { celltypes: toFetch },
      client,
      skip: !toFetch
    }
  )

  /**
   * 
   * @param x 
   */
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

  // Event handler for button click to update user-entered information
  const handleFetch = () => {
    // Update user-entered information in state
    // This will trigger the useEffect hook to refetch the query
    console.log(extractCellNames())
    setToFetch(extractCellNames());
  };

  useEffect(() => {
    refetch({ celltypes: toFetch });
  }, [toFetch, refetch])


  //Wrap in useMemo to stop rerender of tree when cursor changes here
  const cellTypeTree = useMemo(() => {
    return (
      <CellTypeTree
        width={1000}
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

  return (
    <Grid2 container mt={3} spacing={2} sx={{ cursor }} >
      <Grid2 xs={12} lg={8}>
        {cellTypeTree}
      </Grid2>
      <Grid2 xs={12} lg={4}>
        <Tooltip title="Note: Not all cells are stimulable">
          <Button variant="outlined">Stimulate All</Button>
        </Tooltip>
        <Button variant="outlined" onClick={() => handleStimulateAll("U")}>Unstimulate All</Button>
        <Tooltip title="Tip: Holding Option/Command (MacOS) or Alt/Windows (Windows) will enter stimulate mode">
          <Button variant="outlined" onClick={handleToggleStimulateMode}>{stimulateMode ? 'Exit Stimulate Mode' : 'Enter Stimulate Mode'}</Button>
        </Tooltip>
        <Tooltip title="Note: Not all cells are selectable">
          <Button variant="outlined" onClick={() => handleSelectAll(true)}>Select All</Button>
        </Tooltip>
        <Button variant="outlined" onClick={() => handleSelectAll(false)}>Unselect All</Button>
        <Button variant="outlined" onClick={handleFetch}>Fetch cCREs</Button>
        {loading_cellTypeSpecific ?
          <CircularProgress />
          :
          <DataTable
            columns={[
              {
                header: "Accession",
                value: (row: cCRECellTypeData) => row.accession
              },
              {
                header: "Class",
                value: (row: cCRECellTypeData) => row.group
              }
            ]}
            rows={data_cellTypeSpecific?.iCREQuery || []}
            searchable
            emptyText="Please Select a Cell Type to see results"
            tableTitle={toFetch?.length > 0 ? "iCREs active in: " + toFetch.join() : ''}
          />
        }
      </Grid2>
    </Grid2>
  )
}

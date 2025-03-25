import { Button, CircularProgress, IconButton, Link } from "@mui/material"
import { getCellCategoryDisplayname, getStudyLink } from "common/utility"
import { DataGrid, GridColDef, gridFilteredSortedRowEntriesSelector, gridFilteredSortedRowIdsSelector, GridRowSelectionModel, GridToolbar, useGridApiEventHandler, useGridApiRef } from "@mui/x-data-grid"
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid"
import { IcreActivityProps, PointMetadata, SharedIcreActivityPlotProps } from "./IcreActivity"
import { useIcreActivity, UseIcreActivityReturn } from "common/hooks/useIcreActivity"
import { OpenInNew } from "@mui/icons-material"
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"

export type IcreActivityTableProps =
  IcreActivityProps &
  SharedIcreActivityPlotProps &
  {
    onSelectionChange: (selected: PointMetadata[]) => void,
    setSortedFilteredData: Dispatch<SetStateAction<PointMetadata[]>>
  }

const IcreActivityTable = ({ accession, selected, onSelectionChange, iCREActivitydata, setSortedFilteredData, sortedFilteredData }: IcreActivityTableProps) => {

  const {data, loading, error} = iCREActivitydata

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) =>
    <div id={'StopPropogationWrapper'} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>

  // ensure that "field" is accessing a true property of the row
  type TypeSafeColDef<T> = GridColDef & { field: keyof T };

  const columns: TypeSafeColDef<PointMetadata>[] = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF as TypeSafeColDef<PointMetadata>, //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
      width: 60,
      sortable: true,
      hideable: false,
      renderHeader: StopPropagationWrapper
    },
    {
      field: 'biosample',
      headerName: 'Biosample',
      width: 200,
    },
    {
      field: 'assay',
      headerName: 'Assay'
    },
    {
      field: 'value',
      headerName: 'Z-score',
      type: 'number',
      valueFormatter: (value?: number) => value ? value.toFixed(2) : 'null'
    },
    {
      field: 'stimulation',
      headerName: 'Stim',
      valueFormatter: (_, row) => row.stimulation.charAt(0).toUpperCase()
    },
    {
      field: 'lineage',
      headerName: 'Lineage',
      width: 150,
      valueGetter: (_, row) => getCellCategoryDisplayname(row.lineage)
    },
    {
      field: 'link',
      headerName: 'Experiment',
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <IconButton href={params.value} target="_blank" size="small">
            <OpenInNew fontSize="small" />
          </IconButton>
        )
      }
    },
    {
      field: 'study',
      headerName: 'Study',
      width: 140,
      renderCell: (params) => {
        return (
          <Link href={getStudyLink(params.value)} target="_blank">
            {params.value}
          </Link>
        )
      }
    },
  ];

  const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const selectedRows = ids.map((id) => data.find((row) => row.name === id));
    onSelectionChange(selectedRows)
  }

  const apiRef = useGridApiRef()


  const arraysAreEqual = (arr1: PointMetadata[], arr2: PointMetadata[]): boolean => {
    if (arr1.length !== arr2.length) {
      return false
    }
  
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].name !== arr2[i].name) {
        return false
      }
    }
    return true
  };

  const handleSync = () => {
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map(x => x.model) as PointMetadata[]
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      setSortedFilteredData(rows)
    }
  }

  return (
    <DataGrid
      apiRef={apiRef}
      rows={data}
      columns={columns.map(col => { return { ...col, display: 'flex' } })}
      loading={loading}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
        sorting: {
          sortModel: [{ field: 'value', sort: 'desc' }],
        },
        columns: {
          columnVisibilityModel: {
            study: false,
          }
        }
      }}
      sortingOrder={['desc', 'asc', null]}
      slots={{ toolbar: GridToolbar }}
      slotProps={{ toolbar: { showQuickFilter: true } }}
      pageSizeOptions={[10, 25, 50]}
      checkboxSelection
      onRowSelectionModelChange={handleRowSelectionModelChange}
      rowSelectionModel={selected.map(x => x.name)}
      getRowId={(row) => row.name}
      getRowHeight={() => 'auto'}
      keepNonExistentRowsSelected //needed to prevent clearing selections on changing filters
      onStateChange={handleSync}
    />
  )
}

export default IcreActivityTable
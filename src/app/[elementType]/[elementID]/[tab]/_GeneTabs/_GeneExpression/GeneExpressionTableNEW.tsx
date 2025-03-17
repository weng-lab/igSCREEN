import { useGeneExpression } from "common/hooks/useGeneExpression"
import { GeneExpressionProps, PointMetadata } from "./GeneExpression"
import { Checkbox, CircularProgress } from "@mui/material"
import { getCellCategoryDisplayname } from "common/utility"
import { useState } from "react"
import { DataGrid, DataGridProps, GridCallbackDetails, GridColDef, GridRowSelectionModel, GridToolbar } from "@mui/x-data-grid"


export type GeneExpressionTableProps = GeneExpressionProps & {
  onSelectionChange: (selected: PointMetadata[]) => void,
  selected: PointMetadata[]
}

const GeneExpressionTableNew = ({name, id, selected, onSelectionChange}: GeneExpressionTableProps) => {
  const { data, loading, error } = useGeneExpression({ id })

  const columns: GridColDef<PointMetadata>[] = [
    {
      field: 'description',
      headerName: 'Cell Type',
      width: 200
    },
    {
      field: 'value',
      headerName: 'TPM',
      type: 'number',
      width: 100,
    },
    {
      field: 'stimulation',
      headerName: 'Stim',
      width: 100,
      valueFormatter: (_, row) => row.stimulation.charAt(0).toUpperCase()
    },
    {
      field: 'celltype',
      headerName: 'Grouping',
      width: 150,
      valueGetter: (_, row) => getCellCategoryDisplayname(row.celltype)
    },
    {
      field: 'source',
      headerName: 'Source',
      description: 'This column has a value getter and is not sortable.',
      width: 90,
    },
    {
      field: 'expid',
      headerName: 'Experiment ID',
      width: 120
    },
  ];

  const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const selectedRows = ids.map((id) => data.find((row) => row.name === id));
    onSelectionChange(selectedRows)
  }

  return (
    <>
      {loading ?
        <CircularProgress />
        :
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{field: 'value', sort: 'desc'}]
            },
            columns: {
              columnVisibilityModel: {
                source: false,
                expid: false
              }
            }
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelectionModelChange}
          rowSelectionModel={selected.map(x => x.name)}
          disableRowSelectionOnClick
          getRowId={(row) => row.name}
        />}
    </>
  )
}

export default GeneExpressionTableNew
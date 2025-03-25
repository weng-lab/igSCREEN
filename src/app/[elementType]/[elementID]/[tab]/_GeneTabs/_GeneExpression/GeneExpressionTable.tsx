import { useGeneExpression } from "common/hooks/useGeneExpression"
import { GeneExpressionProps, PointMetadata } from "./GeneExpression"
import { CircularProgress, IconButton, Link } from "@mui/material"
import { getCellCategoryDisplayname, getStudyLink } from "common/utility"
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from "@mui/x-data-grid"
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid"
import { OpenInNew } from "@mui/icons-material"

export type GeneExpressionTableProps = GeneExpressionProps & {
  onSelectionChange: (selected: PointMetadata[]) => void,
  selected: PointMetadata[]
}

const GeneExpressionTable = ({name, id, selected, onSelectionChange}: GeneExpressionTableProps) => {
  const { data, loading, error } = useGeneExpression({ id })

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) =>
    <div id={'StopPropagationWrapper'} onClick={(e) => e.stopPropagation()}>
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
      field: 'value',
      headerName: 'TPM',
      type: 'number',
      width: 100,
    },
    {
      field: 'stimulation',
      headerName: 'Stim',
      width: 80,
      valueGetter: (_, row) => row.stimulation.charAt(0).toUpperCase()
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
            <OpenInNew fontSize="small"/>
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

  return (
    <>
      {loading ?
        <CircularProgress />
        :
        <DataGrid
          rows={[...data].sort((a,b) => b.value - a.value)}
          columns={columns.map(col => { return { ...col, display: 'flex' } })}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{field: 'value', sort: 'desc'}],
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
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          getRowId={(row) => row.name}
          keepNonExistentRowsSelected //needed to prevent clearing selections on changing filters
        />}
    </>
  )
}

export default GeneExpressionTable
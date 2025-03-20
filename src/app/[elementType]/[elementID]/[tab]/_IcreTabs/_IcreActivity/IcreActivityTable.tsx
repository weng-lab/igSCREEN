import { CircularProgress } from "@mui/material"
import { getCellCategoryDisplayname } from "common/utility"
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from "@mui/x-data-grid"
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid"
import { IcreActivityProps, PointMetadata } from "./IcreActivity"

export type IcreActivityTableProps = IcreActivityProps & {
  onSelectionChange: (selected: PointMetadata[]) => void,
  selected: PointMetadata[]
}

const IcreActivityTable = ({accession, selected, onSelectionChange}: IcreActivityTableProps) => {
  
  /**
   * @todo create data fetching hook for iCRE activity and put here
   */
  // const { data, loading, error } = useGeneExpression({ id })
  const data = []
  const loading = false

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) =>
    <div id={'StopPropogationWrapper'} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>

  /**
   * @todo change columns based on metadata of each point
   */
  const columns: GridColDef<PointMetadata>[] = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF, //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
      
      width: 60,
      sortable: true,
      hideable: false,
      renderHeader: StopPropagationWrapper
    },
    {
      field: 'description',
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
      width: 100,
      valueFormatter: (_, row) => row.stimulation.charAt(0).toUpperCase()
    },
    {
      field: 'celltype',
      headerName: 'Lineage',
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
          rows={[...data].sort((a, b) => b.value - a.value)}
          columns={columns}
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
                source: false,
                expid: false
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
          getRowId={(row) => row.name}
          keepNonExistentRowsSelected //needed to prevent clearing selections on changing filters
        />}
    </>
  )
}

export default IcreActivityTable
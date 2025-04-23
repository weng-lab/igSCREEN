import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression"
import { IconButton, Link } from "@mui/material"
import { getCellCategoryDisplayname, getStudyLink } from "common/utility"
import { GridColDef, gridFilteredSortedRowEntriesSelector, GridRowSelectionModel, GridToolbar, useGridApiRef, GRID_CHECKBOX_SELECTION_COL_DEF, DataGridPro } from "@mui/x-data-grid-pro"
import { OpenInNew } from "@mui/icons-material"
import { Dispatch, SetStateAction } from "react"

export type GeneExpressionTableProps = 
GeneExpressionProps & 
SharedGeneExpressionPlotProps &
{
  onSelectionChange: (selected: PointMetadata[]) => void,
  setSortedFilteredData: Dispatch<SetStateAction<PointMetadata[]>>
}

const GeneExpressionTable = ({name, id, selected, onSelectionChange, geneExpressionData, setSortedFilteredData, sortedFilteredData}: GeneExpressionTableProps) => {
  const { data, loading, error } = geneExpressionData

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
      valueGetter: (_, row) => row.value.toFixed(1)
    },
    {
      field: 'stimulation',
      headerName: 'Stimulation',
      width: 80,
      valueGetter: (_, row) => row.stimulation.charAt(0) === "u" ? "Unstim" : "Stim"
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
        <DataGridPro
          apiRef={apiRef}
          rows={data || []}
          columns={columns.map(col => { return { ...col, display: 'flex' } })}
          loading={loading}
          pagination
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
          slotProps={{ toolbar: { showQuickFilter: true, sx: {p: 1} } }}
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

export default GeneExpressionTable
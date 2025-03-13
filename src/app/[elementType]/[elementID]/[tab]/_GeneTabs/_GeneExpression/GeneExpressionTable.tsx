import { DataTable, DataTableColumn, DataTableProps } from "@weng-lab/psychscreen-ui-components"
import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression"
import { GeneExpressionProps, PointMetadata } from "./GeneExpression"
import { CircularProgress, Typography } from "@mui/material"
import { getCellCategoryDisplayname } from "common/utility"

/**
 * @todo link experiments to paper or source, need info on where to link to
 */


export type GeneExpressionTableProps<T> =
  GeneExpressionProps
  & Partial<DataTableProps<T>>

const GeneExpressionTable = <T extends PointMetadata>({name, id, ...rest}: GeneExpressionTableProps<T>) => {
  const { data, loading, error } = useGeneExpression({ id })

  const cols: DataTableColumn<PointMetadata>[] = [
    {
      header: "Cell Type",
      value: (row) => `${row.description}`
    },
    {
      header: "Stim",
      tooltip: "'S' if cell has been stimulated, 'U' for unstimulated",
      value: (row) => row.stimulation.charAt(0).toUpperCase()
    },
    {
      header: "TPM",
      HeaderRender: () => <Typography variant="body2">TPM</Typography>,
      value: (row) => row.value.toFixed(2)
    },
    {
      header: "Category",
      value: (row) => getCellCategoryDisplayname(row.celltype)
    },
    {
      header: "Source",
      value: (row) => row.source
    },
  ]

  return (
    loading ?
      <CircularProgress /> 
      :
      <DataTable
        rows={data || []}
        tableTitle={`${name} Gene Expression`}
        columns={cols}
        sortColumn={2}
        searchable
        {...rest}
      />
  )
}

export default GeneExpressionTable
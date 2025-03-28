import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression"
import VerticalBarPlot, { BarData, BarPlotProps } from "../../VerticalBarPlot"
import { useMemo } from "react"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"

export type GeneExpressionBarPlotProps = 
  GeneExpressionProps & 
  SharedGeneExpressionPlotProps &
  Partial<BarPlotProps<PointMetadata>>

const GeneExpressionBarPlot = ({name, id, selected, sortedFilteredData, ...rest}: GeneExpressionBarPlotProps) => {

  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return []
    return (
      sortedFilteredData.map((x, i) => {
        const anySelected = selected.length > 0
        const isSelected = selected.some(y => y.name === x.name)
        return (
          {
            category: getCellCategoryDisplayname(x.lineage),
            label: `${x.value.toFixed(2)}, ${x.biosample.slice(0, 23) + (x.biosample.length > 23 ? "..." : "")}`,
            value: x.value,
            id: i.toString(),
            color: (anySelected && isSelected || !anySelected) ? getCellCategoryColor(x.lineage) : '#CCCCCC',
            metadata: x
          }
        )
      })
    )
  }, [sortedFilteredData, selected])

  return(
    <VerticalBarPlot
      {...rest}
      data={plotData}
      topAxisLabel={`${name} Expression - Linear TPM`}
    />
  )
}

export default GeneExpressionBarPlot
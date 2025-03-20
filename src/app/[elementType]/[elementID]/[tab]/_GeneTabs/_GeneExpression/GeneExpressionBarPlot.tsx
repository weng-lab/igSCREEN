import { GeneExpressionProps, PointMetadata } from "./GeneExpression"
import { useGeneExpression } from "common/hooks/useGeneExpression"
import VerticalBarPlot, { BarData, BarPlotProps } from "./VerticalBarPlot"
import { useMemo } from "react"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"

export type GeneExpressionBarPlotProps = 
  GeneExpressionProps & 
  {
    onBarClicked: BarPlotProps<PointMetadata>["onBarClicked"]
    selected: PointMetadata[]
  }

const GeneExpressionBarPlot = ({name, id, onBarClicked, selected}: GeneExpressionBarPlotProps) => {
  const { data, loading, error } = useGeneExpression({ id })

  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!data) return []
    return (
      data.map((x, i) => {
        const anySelected = selected.length > 0
        const isSelected = selected.includes(x)
        return (
          {
            category: getCellCategoryDisplayname(x.celltype),
            label: `${x.value.toFixed(2)}, ${x.description.slice(0, 30) + (x.description.length > 30 ? "..." : "")}`,
            value: x.value,
            id: i.toString(),
            color: (anySelected && isSelected || !anySelected) ? getCellCategoryColor(x.celltype) : '#CCCCCC',
            metadata: x
          }
        )
      })
    ).sort((a,b) => b.value - a.value)
  }, [data, selected])

  return(
    <VerticalBarPlot
      data={plotData}
      onBarClicked={onBarClicked}
      topAxisLabel={`${name} Expression - Linear TPM`}
    />
  )
}

export default GeneExpressionBarPlot
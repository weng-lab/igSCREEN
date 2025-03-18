import { GeneExpressionProps, PointMetadata } from "./GeneExpression"
import { useGeneExpression } from "common/hooks/useGeneExpression"
import VerticalBarPlot, { BarData, BarPlotProps } from "./VerticalBarPlot"
import { useMemo } from "react"
import { getCellCategoryColor } from "common/utility"

export type GeneExpressionBarPlotProps = 
  GeneExpressionProps & 
  {
    onBarClicked: BarPlotProps<PointMetadata>["onBarClicked"]
  }

const GeneExpressionBarPlot = ({name, id, onBarClicked}: GeneExpressionBarPlotProps) => {
  const { data, loading, error } = useGeneExpression({ id })

  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!data) return []
    return (
      data.map((x, i) => {
        return (
          {
            category: x.celltype,
            label: `${x.value.toFixed(2)}, ${x.description.slice(0, 30) + (x.description.length > 30 ? "..." : "")}`,
            value: x.value,
            id: i.toString(),
            color: getCellCategoryColor(x.celltype),
            metadata: x
          }
        )
      })
    ).sort((a,b) => b.value - a.value)
  }, [data])

  return(
    <VerticalBarPlot
      key={JSON.stringify(plotData)}
      data={plotData}
      onBarClicked={onBarClicked}
    />
  )
}

export default GeneExpressionBarPlot
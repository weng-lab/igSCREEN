import { IcreActivityProps, PointMetadata, SharedIcreActivityPlotProps } from "./IcreActivity"
import VerticalBarPlot, { BarData, BarPlotProps } from "../../VerticalBarPlot"
import { useMemo } from "react"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"

export type IcreActivityBarPlotProps = 
  IcreActivityProps & 
  SharedIcreActivityPlotProps &
  {
    onBarClicked: BarPlotProps<PointMetadata>["onBarClicked"],
  }

const IcreActivityBarPlot = ({accession, selected, onBarClicked, sortedFilteredData}: IcreActivityBarPlotProps) => {

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
  }, [selected, sortedFilteredData])

  return(
    <VerticalBarPlot
      data={plotData}
      onBarClicked={onBarClicked}
      topAxisLabel={`${accession} Z-scores`}
      show95thPercentileLine
      cutoffNegativeValues
    />
  )
}

export default IcreActivityBarPlot
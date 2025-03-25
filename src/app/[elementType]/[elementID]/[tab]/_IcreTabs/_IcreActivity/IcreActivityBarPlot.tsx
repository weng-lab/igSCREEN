import { IcreActivityProps, PointMetadata, SharedIcreActivityPlotProps } from "./IcreActivity"
import VerticalBarPlot, { BarData, BarPlotProps } from "../../VerticalBarPlot"
import { useMemo } from "react"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"
import { useIcreActivity } from "common/hooks/useIcreActivity"

export type IcreActivityBarPlotProps = 
  IcreActivityProps & 
  SharedIcreActivityPlotProps &
  {
    onBarClicked: BarPlotProps<PointMetadata>["onBarClicked"]
  }

const IcreActivityBarPlot = ({accession, selected, assays, onBarClicked}: IcreActivityBarPlotProps) => {
  const { data, loading, error } = useIcreActivity({ accession, assays })

  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!data) return []
    return (
      data.map((x, i) => {
        const anySelected = selected.length > 0
        const isSelected = selected.some(y => y.name === x.name)
        return (
          {
            category: getCellCategoryDisplayname(x.lineage),
            label: `${x.value.toFixed(2)}, ${x.biosample.slice(0, 30) + (x.biosample.length > 30 ? "..." : "")}`,
            value: x.value,
            id: i.toString(),
            color: (anySelected && isSelected || !anySelected) ? getCellCategoryColor(x.lineage) : '#CCCCCC',
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
      topAxisLabel={`${accession} ${assays.length === 2 ? "ATAC & DNase" : assays[0]} Z-scores`}
      show95thPercentileLine
      cutoffNegativeValues
    />
  )
}

export default IcreActivityBarPlot
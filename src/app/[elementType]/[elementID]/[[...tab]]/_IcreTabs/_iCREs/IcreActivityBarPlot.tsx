import { IcreActivityProps, PointMetadata } from "./IcreActivity";
import VerticalBarPlot, { BarData } from "common/components/VerticalBarPlot";
import { useMemo } from "react";
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility";
import { Box } from "@mui/material";
import { UseIcreActivityReturn } from "common/hooks/useIcreActivity";

export type IcreActivityBarPlotProps = {
  accession: IcreActivityProps["accession"];
  iCREActivitydata: UseIcreActivityReturn;
  selected: PointMetadata[];
  sortedFilteredData: PointMetadata[];
  toggleSelection: (item: PointMetadata) => void;
  getRowId: (item: PointMetadata) => string;
};

const IcreActivityBarPlot = ({ accession, selected, sortedFilteredData, toggleSelection, getRowId }: IcreActivityBarPlotProps) => {
  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x, i) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => getRowId(y) === getRowId(x));
      return {
        category: getCellCategoryDisplayname(x.lineage),
        label: `${x.value.toFixed(2)}, ${x.biosample.slice(0, 23) + (x.biosample.length > 23 ? "..." : "")}`,
        value: x.value,
        id: i.toString(),
        color: (anySelected && isSelected) || !anySelected ? getCellCategoryColor(x.lineage) : "#CCCCCC",
        metadata: x,
      };
    });
  }, [selected, sortedFilteredData, getRowId]);

  return (
    <Box width={"100%"} height={"100%"} overflow={"auto"} padding={1}>
      <VerticalBarPlot
        data={plotData}
        topAxisLabel={`${accession} Z-scores`}
        show95thPercentileLine
        cutoffNegativeValues
        onBarClicked={(bar) => toggleSelection(bar.metadata)}
      />
    </Box>
  );
};

export default IcreActivityBarPlot;

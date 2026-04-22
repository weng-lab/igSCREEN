import { GeneExpressionProps, PointMetadata } from "./GeneExpression";
import VerticalBarPlot, { BarData } from "common/components/VerticalBarPlot";
import { useMemo } from "react";
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility";
import { Box } from "@mui/material";
import { UseGeneExpressionReturn } from "common/hooks/useGeneExpression";

export type GeneExpressionBarPlotProps = {
  geneData: GeneExpressionProps["geneData"];
  geneExpressionData: UseGeneExpressionReturn;
  selected: PointMetadata[];
  sortedFilteredData: PointMetadata[];
  toggleSelection: (item: PointMetadata) => void;
  getRowId: (item: PointMetadata) => string;
};

const GeneExpressionBarPlot = ({ geneData, selected, sortedFilteredData, toggleSelection, getRowId }: GeneExpressionBarPlotProps) => {
  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x, i) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => getRowId(y) === getRowId(x));
      return {
        category: getCellCategoryDisplayname(x.lineage),
        label: `${x.value.toFixed(1)}, ${x.biosample.slice(0, 23) + (x.biosample.length > 23 ? "..." : "")}`,
        value: x.value,
        id: i.toString(),
        color: (anySelected && isSelected) || !anySelected ? getCellCategoryColor(x.lineage) : "#CCCCCC",
        metadata: x,
      };
    });
  }, [sortedFilteredData, selected, getRowId]);

  return (
    <Box width={"100%"} height={"100%"} overflow={"auto"} padding={1}>
      <VerticalBarPlot
        data={plotData}
        topAxisLabel={`${geneData?.data.name} Expression - TPM`}
        onBarClicked={(bar) => toggleSelection(bar.metadata)}
      />
    </Box>
  );
};

export default GeneExpressionBarPlot;

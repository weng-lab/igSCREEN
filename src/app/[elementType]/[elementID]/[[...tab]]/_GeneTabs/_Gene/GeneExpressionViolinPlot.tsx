import { GeneExpressionProps, PointMetadata } from "./GeneExpression";
import { Dispatch, SetStateAction, useMemo } from "react";
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility";
import { Box } from "@mui/material";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { UseGeneExpressionReturn } from "common/hooks/useGeneExpression";

export type GeneExpressionViolinPlotProps = {
  geneData: GeneExpressionProps["geneData"];
  geneExpressionData: UseGeneExpressionReturn;
  selected: PointMetadata[];
  setSelected: Dispatch<SetStateAction<PointMetadata[]>>;
  sortedFilteredData: PointMetadata[];
  toggleSelection: (item: PointMetadata) => void;
  getRowId: (item: PointMetadata) => string;
};

const GeneExpressionViolinPlot = ({ geneData, selected, setSelected, sortedFilteredData, toggleSelection }: GeneExpressionViolinPlotProps) => {
  const violinData: Distribution<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return [];

    const grouped = sortedFilteredData.reduce((acc, item) => {
      const key = item.lineage;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, PointMetadata[]>);

    return Object.entries(grouped).map(([lineage, group]) => {
      const values = group.map((d) => d.value);
      const label = getCellCategoryDisplayname(lineage);
      const violinColor =
        selected.length === 0 || group.every((d) => selected.some((s) => s.name === d.name))
          ? getCellCategoryColor(lineage)
          : "grey";

      const data: ViolinPoint<PointMetadata>[] = values.map((value, i) => {
        const metadata = group[i];
        const isSelected = selected.length === 0 || selected.some((s) => s.name === metadata.name);
        const pointColor = isSelected ? getCellCategoryColor(lineage) : "grey";
        const pointRadius = isSelected ? 4 : 2;

        return values.length < 3
          ? { value, radius: pointRadius, tissue: lineage, metadata, color: pointColor }
          : { value, radius: selected.length === 0 ? 2 : pointRadius, tissue: lineage, metadata, color: pointColor };
      });

      return { label, data, violinColor };
    });
  }, [selected, sortedFilteredData]);

  return (
    <Box width={"100%"} height={"100%"} overflow={"auto"} padding={1}>
      <ViolinPlot
        distributions={violinData}
        axisLabel={`${geneData?.data.name} Expression - TPM`}
        loading={geneData.loading}
        labelOrientation="leftDiagonal"
        violinProps={{
          bandwidth: "scott",
          showAllPoints: true,
          jitter: 10,
        }}
        onViolinClicked={(violin) => {
          const group = violin.data.map((p) => p.metadata);
          if (selected.length === group.length && selected[0]?.lineage === group[0]?.lineage) {
            setSelected([]);
          } else setSelected(group);
        }}
        onPointClicked={(point) => toggleSelection(point.metadata)}
        pointTooltipBody={(point) => (
          <Box>
            <div>
              <strong>Biosample:</strong> {point.metadata?.biosample}
            </div>
            <div>
              <strong>TPM:</strong> {point.value.toFixed(1)}
            </div>
            <div>
              <strong>Stimulation:</strong> {point.metadata?.stimulation}
            </div>
            <div>
              <strong>Lineage:</strong> {point.metadata?.lineage}
            </div>
            <div>
              <strong>Study:</strong> {point.metadata?.study}
            </div>
          </Box>
        )}
      />
    </Box>
  );
};

export default GeneExpressionViolinPlot;

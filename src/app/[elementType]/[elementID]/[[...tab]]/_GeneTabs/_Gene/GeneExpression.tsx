import { TwoPaneLayout, useTablePlotSync } from "@weng-lab/ui-components";
import GeneExpressionTable from "./GeneExpressionTable";
import GeneExpressionUMAP from "./GeneExpressionUMAP";
import GeneExpressionBarPlot from "./GeneExpressionBarPlot";
import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
import { BarChart, ScatterPlot, CandlestickChart } from "@mui/icons-material";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import GeneExpressionViolinPlot from "./GeneExpressionViolinPlot";

export type PointMetadata = UseGeneExpressionReturn["data"][number];

export type GeneExpressionProps = {
  geneData: UseGeneDataReturn<{ name: string }>;
};

const GeneExpression = ({ geneData }: GeneExpressionProps) => {
  const geneExpressionData = useGeneExpression({ id: geneData?.data.id });

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows: geneExpressionData.data ?? [],
    getRowId: (r) => r.name,
  });

  return (
    <TwoPaneLayout
      direction={{ xs: "column", lg: "row" }}
      TableComponent={
        <GeneExpressionTable
          geneData={geneData}
          tableProps={tableProps}
          geneExpressionData={geneExpressionData}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <GeneExpressionBarPlot
              geneData={geneData}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
            />
          ),
        },
        {
          tabTitle: "UMAP",
          icon: <ScatterPlot />,
          plotComponent: (
            <GeneExpressionUMAP
              geneData={geneData}
              selected={selected}
              setSelected={setSelected}
              geneExpressionData={geneExpressionData}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <GeneExpressionViolinPlot
              geneData={geneData}
              selected={selected}
              setSelected={setSelected}
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
            />
          ),
        },
      ]}
    />
  );
};

export default GeneExpression;

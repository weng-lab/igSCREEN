import TwoPaneLayout from "../../../../../../common/components/TwoPaneLayout"
import { useState } from "react"
import GeneExpressionTable from "./GeneExpressionTable"
import GeneExpressionUMAP from "./GeneExpressionUMAP"
import GeneExpressionBarPlot from "./GeneExpressionBarPlot"
import { BarData } from "../../../../../../common/components/VerticalBarPlot"
import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression"
import { BarChart, ScatterPlot, CandlestickChart } from "@mui/icons-material"
import { UseGeneDataReturn } from "common/hooks/useGeneData"
import GeneExpressionViolinPlot from "./GeneExpressionViolinPlot"
import { Distribution } from "@weng-lab/psychscreen-ui-components"

export type PointMetadata = UseGeneExpressionReturn["data"][number]

export type SharedGeneExpressionPlotProps = {
  selected: PointMetadata[],
  geneExpressionData: UseGeneExpressionReturn,
  sortedFilteredData: PointMetadata[]
}

export type GeneExpressionProps = {
  geneData: UseGeneDataReturn<{ name: string }>
}

const GeneExpression = ({ geneData }: GeneExpressionProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<PointMetadata[]>([]);

  const geneExpressionData = useGeneExpression({ id: geneData?.data.id });

  const handlePointsSelected = (pointsInfo: PointMetadata[]) => {
    setSelected([...selected, ...pointsInfo]);
  };

  const handleSelectionChange = (selected: PointMetadata[]) => {
    setSelected(selected);
  };

  const handleBarClick = (bar: BarData<PointMetadata>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter((x) => x !== bar.metadata));
    } else setSelected([...selected, bar.metadata]);
  };

  const handleViolinClick = (violin: Distribution<PointMetadata>) => {
    console.log(violin)
    const data = violin.data
    let allSelected: PointMetadata[] = []
    data.forEach((point) => {
      if (selected.includes(point.metaData)) {
        allSelected = (selected.filter((x) => x !== point.metaData));
      } else allSelected = ([...selected, point.metaData]);
    }
    )
    setSelected(allSelected)
  };

  return (
    <TwoPaneLayout
      TableComponent={
        <GeneExpressionTable
          geneData={geneData}
          selected={selected}
          onSelectionChange={handleSelectionChange}
          sortedFilteredData={sortedFilteredData}
          setSortedFilteredData={setSortedFilteredData}
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
              onBarClicked={handleBarClick}
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
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              onSelectionChange={(points) => handlePointsSelected(points.map((x) => x.metaData))}
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
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              onViolinClicked={handleViolinClick}
            />
          ),
        },
      ]}
    />
  );
};

export default GeneExpression
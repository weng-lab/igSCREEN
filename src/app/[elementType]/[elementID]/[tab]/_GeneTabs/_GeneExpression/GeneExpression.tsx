import TwoPaneLayout from "../../TwoPaneLayout"
import { GeneExpressionQuery } from "types/generated/graphql"
import { useState } from "react"
import GeneExpressionTable from "./GeneExpressionTable"
import GeneExpressionUMAP from "./GeneExpressionUMAP"
import GeneExpressionBarPlot from "./GeneExpressionBarPlot"
import { BarData } from "../../VerticalBarPlot"
import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression"
import { BarChart, ScatterPlot } from "@mui/icons-material"


export type GeneExpressionProps = {
  name: string,
  id: string
}

export type PointMetadata = UseGeneExpressionReturn["data"][number]

export type SharedGeneExpressionPlotProps = {
  selected: PointMetadata[],
  geneExpressionData: UseGeneExpressionReturn,
  sortedFilteredData: PointMetadata[]
}

const GeneExpression = ({ name, id }: GeneExpressionProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([])
  const [sortedFilteredData, setSortedFilteredData] = useState<PointMetadata[]>([])

  const geneExpressionData = useGeneExpression({ id })

  const handlePointsSelected = (pointsInfo: PointMetadata[]) => {
    setSelected([...selected, ...pointsInfo])
  }

  const handleSelectionChange = (selected: PointMetadata[]) => {
    setSelected(selected)
  }

  const handleBarClick = (bar: BarData<PointMetadata>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter(x => x !== bar.metadata))
    } else setSelected([...selected, bar.metadata])
  }

  return (
    <TwoPaneLayout
      TableComponent={
          <GeneExpressionTable
            name={name}
            id={id}
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
            plotComponent:
              <GeneExpressionBarPlot
                name={name}
                id={id}
                selected={selected}
                sortedFilteredData={sortedFilteredData}
                geneExpressionData={geneExpressionData}
                onBarClicked={handleBarClick}
              />
          },
          {
            tabTitle: "UMAP",
            icon: <ScatterPlot />,
            plotComponent:
              <GeneExpressionUMAP
                name={name}
                id={id}
                selected={selected}
                sortedFilteredData={sortedFilteredData}
                geneExpressionData={geneExpressionData}
                onSelectionChange={(points) => handlePointsSelected(points.map(x => x.metaData))}
              />
          }
        ]}
      />
  )
}

export default GeneExpression
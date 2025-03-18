import TwoPaneLayout from "./TwoPaneLayout"
import { GeneExpressionQuery } from "types/generated/graphql"
import { useState } from "react"
import GeneExpressionTable from "./GeneExpressionTable"
import GeneExpressionUMAP from "./GeneExpressionUMAP"
import GeneExpressionBarPlot from "./GeneExpressionBarPlot"


export type GeneExpressionProps = {
  name: string,
  id: string
}

export type PointMetadata = GeneExpressionQuery["immuneRnaUmapQuery"][0]

const GeneExpression = ({ name, id }: GeneExpressionProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([])

  const handlePointsSelected = (pointsInfo: PointMetadata[]) => {
    setSelected([...selected, ...pointsInfo])
  }

  const handleSelectionChange = (selected: PointMetadata[]) => {
    setSelected(selected)
  }

  return (
    <TwoPaneLayout
      TableComponent={
          <GeneExpressionTable
            name={name}
            id={id}
            selected={selected}
            onSelectionChange={handleSelectionChange}
          />
        }
        plots={[
          {
            tabTitle: "Bar Plot",
            plotComponent:
              <GeneExpressionBarPlot
                name={name}
                id={id}
                onBarClicked={(bar) => handleSelectionChange([bar.metadata])}
              />
          },
          {
            tabTitle: "UMAP",
            plotComponent:
              <GeneExpressionUMAP
                name={name}
                id={id}
                selectedPoints={selected}
                onSelectionChange={(points) => handlePointsSelected(points.map(x => x.metaData))}
              />
          }
        ]}
      />
  )
}

export default GeneExpression
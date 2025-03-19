import TwoPaneLayout from "./TwoPaneLayout"
import { GeneExpressionQuery } from "types/generated/graphql"
import { useState } from "react"
import GeneExpressionTable from "./GeneExpressionTable"
import GeneExpressionUMAP from "./GeneExpressionUMAP"
import GeneExpressionBarPlot from "./GeneExpressionBarPlot"
import { BarData } from "./VerticalBarPlot"


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

  const handleBarClick = (bar: BarData<PointMetadata>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter(x => x !== bar.metadata))
    } else setSelected([...selected, bar.metadata])
  }

  /**
   * In order to make the subset plot work I would need to have some way to capture a 
   * state that includes the points used to make the subset plot. I think I can use the same state variable 
   * for highlighting still. Would need to pass
   */

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
                selected={selected}
                onBarClicked={handleBarClick}
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
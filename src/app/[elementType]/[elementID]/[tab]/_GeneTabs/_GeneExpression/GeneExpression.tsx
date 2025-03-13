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
  const [hovered, setHovered] = useState<PointMetadata>(null)

  const handleRowClick = (pointInfo: PointMetadata) => {
    if (selected.some(x => x.name === pointInfo.name)) {
      setSelected(selected.filter(x => x.name !== pointInfo.name)) // filter out if included
    } else setSelected([...selected, pointInfo]) // else add to selected
  }

  const handleRowMouseEnter = (pointInfo: PointMetadata) => {
    setHovered(pointInfo) // add point even if selected (so we can remove on mouse leave)
  }

  const handleRowMouseLeave = (pointInfo: PointMetadata) => {
    setSelected(null)
  }

  const handlePointClick = (pointInfo: PointMetadata) => {
    setSelected([...selected, pointInfo])
  }

  let x = [...selected]
  if (hovered) x.push(hovered)

  return (
    <TwoPaneLayout
      TableComponent={
        <GeneExpressionTable
          name={name}
          id={id}
          onRowClick={handleRowClick}
          // onRowMouseEnter={handleRowMouseEnter}
          // onRowMouseLeave={handleRowMouseLeave}
          highlighted={x}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          plotComponent:
            <GeneExpressionBarPlot 
              name={name}
              id={name}
            />
        },
        {
        tabTitle: "UMAP",
        plotComponent: 
          <GeneExpressionUMAP
            name={name}
            id={id}
            selectedPoints={x}
          />
      }
    ]}
    />
  )
}

export default GeneExpression
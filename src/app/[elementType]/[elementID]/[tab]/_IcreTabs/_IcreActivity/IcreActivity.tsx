import TwoPaneLayout from "../../TwoPaneLayout"
import { GeneExpressionQuery } from "types/generated/graphql"
import { useState } from "react"
import { BarData } from "../../VerticalBarPlot"
import IcreActivityTable from "./IcreActivityTable"


export type IcreActivityProps = {
  accession: string,
}

// export type PointMetadata = GeneExpressionQuery["immuneRnaUmapQuery"][0]
/**
 * @todo create data fetching hook, and put correct type of data here
 */
export type PointMetadata = any

const IcreActivity = ({ accession }: IcreActivityProps) => {
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

  return (
    <TwoPaneLayout
      TableComponent={
        <IcreActivityTable
          accession={accession}
          onSelectionChange={handleSelectionChange}
          selected={[]}
        />
        }
        plots={[
          // {
          //   tabTitle: "Bar Plot",
          //   plotComponent:
          //     <GeneExpressionBarPlot
          //       name={name}
          //       id={id}
          //       selected={selected}
          //       onBarClicked={handleBarClick}
          //     />
          // },
          // {
          //   tabTitle: "UMAP",
          //   plotComponent:
          //     <GeneExpressionUMAP
          //       name={name}
          //       id={id}
          //       selectedPoints={selected}
          //       onSelectionChange={(points) => handlePointsSelected(points.map(x => x.metaData))}
          //     />
          // }
        ]}
      />
  )
}

export default IcreActivity
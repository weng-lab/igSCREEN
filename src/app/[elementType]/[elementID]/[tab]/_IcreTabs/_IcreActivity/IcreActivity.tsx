import TwoPaneLayout from "../../TwoPaneLayout"
import { useEffect, useState } from "react"
import { BarData } from "../../VerticalBarPlot"
import IcreActivityTable from "./IcreActivityTable"
import { IcreActivityAssay, useIcreActivity, UseIcreActivityReturn } from "common/hooks/useIcreActivity"
import IcreActivityBarPlot from "./IcreActivityBarPlot"
import { FormControl, FormLabel, FormControlLabel, FormGroup, Checkbox } from "@mui/material"
import IcreActivityUMAP from "./IcreActivityUMAP"


export type IcreActivityProps = {
  accession: string,
}

export type PointMetadata = UseIcreActivityReturn["data"][number]

export type SharedIcreActivityPlotProps = {
  selected: PointMetadata[],
  iCREActivitydata: UseIcreActivityReturn,
  sortedFilteredData: PointMetadata[]
}

const IcreActivity = ({ accession }: IcreActivityProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([])
  const [sortedFilteredData, setSortedFilteredData] = useState<PointMetadata[]>([])

  const iCREActivitydata = useIcreActivity({ accession, assays: ['ATAC', 'DNase'] })

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
    <>
      <TwoPaneLayout
        TableComponent={
          <IcreActivityTable
            accession={accession}
            onSelectionChange={handleSelectionChange}
            sortedFilteredData={sortedFilteredData}
            setSortedFilteredData={setSortedFilteredData}
            iCREActivitydata={iCREActivitydata}
            selected={selected}
          />
        }
        plots={[
          {
            tabTitle: "Bar Plot",
            plotComponent:
              <IcreActivityBarPlot
                accession={accession}
                sortedFilteredData={sortedFilteredData}
                iCREActivitydata={iCREActivitydata}
                selected={selected}
                onBarClicked={handleBarClick}
              />
          },
          {
            tabTitle: "UMAP",
            plotComponent:
              <IcreActivityUMAP
                accession={accession}
                sortedFilteredData={sortedFilteredData}
                iCREActivitydata={iCREActivitydata}
                selected={selected}
                onSelectionChange={(points) => handlePointsSelected(points.map(x => x.metaData))}
              />
          }
        ]}
      />
    </>
  )
}

export default IcreActivity
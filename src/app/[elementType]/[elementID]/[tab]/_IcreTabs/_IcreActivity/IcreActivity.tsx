import TwoPaneLayout from "../../TwoPaneLayout"
import { useState } from "react"
import { BarData } from "../../VerticalBarPlot"
import IcreActivityTable from "./IcreActivityTable"
import { IcreActivityAssay, UseIcreActivityReturn } from "common/hooks/useIcreActivity"
import IcreActivityBarPlot from "./IcreActivityBarPlot"
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material"
import IcreActivityUMAP from "./IcreActivityUMAP"


export type IcreActivityProps = {
  accession: string,
}

export type PointMetadata = UseIcreActivityReturn["data"][number]

export type SharedIcreActivityPlotProps = {
  selected: PointMetadata[],
  assay: IcreActivityAssay
}

const IcreActivity = ({ accession }: IcreActivityProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([])
  const [assay, setAssay] = useState<IcreActivityAssay>('combined')

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

  const handleSetAssay = (assay: IcreActivityAssay) => {
    setAssay(assay)
  }

  const AssayRadioButtons = () => {
    return (
      <FormControl>
        <FormLabel id='assay-radio-buttons'>Assay</FormLabel>
        <RadioGroup
          aria-labelledby="assay-radio-buttons"
          defaultValue="combined"
          row
          value={assay}
          onChange={(_, value) => handleSetAssay(value as IcreActivityAssay)}
        >
          <FormControlLabel value="combined" control={<Radio />} label="ATAC & DNase" />
          <FormControlLabel value="ATAC" control={<Radio />} label="ATAC" />
          <FormControlLabel value="DNase" control={<Radio />} label="DNase" />
        </RadioGroup>
      </FormControl>
    )
  }

  return (
    <>
      <AssayRadioButtons />
      <TwoPaneLayout
        TableComponent={
          <IcreActivityTable
            accession={accession}
            onSelectionChange={handleSelectionChange}
            selected={selected}
            assay={assay}
          />
        }
        plots={[
          {
            tabTitle: "Bar Plot",
            plotComponent:
              <IcreActivityBarPlot
                accession={accession}
                selected={selected}
                assay={assay}
                onBarClicked={handleBarClick}
              />
          },
          {
            tabTitle: "UMAP",
            plotComponent:
              <IcreActivityUMAP
                accession={accession}
                assay={assay}
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
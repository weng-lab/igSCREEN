import TwoPaneLayout from "../../TwoPaneLayout"
import { useState } from "react"
import { BarData } from "../../VerticalBarPlot"
import IcreActivityTable from "./IcreActivityTable"
import { IcreActivityAssay, UseIcreActivityReturn } from "common/hooks/useIcreActivity"
import IcreActivityBarPlot from "./IcreActivityBarPlot"
import { FormControl, FormLabel, FormControlLabel, FormGroup, Checkbox } from "@mui/material"
import IcreActivityUMAP from "./IcreActivityUMAP"


export type IcreActivityProps = {
  accession: string,
}

export type PointMetadata = UseIcreActivityReturn["data"][number]

export type SharedIcreActivityPlotProps = {
  selected: PointMetadata[],
  assays: IcreActivityAssay[]
}

const IcreActivity = ({ accession }: IcreActivityProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([])
  const [assays, setAssays] = useState<IcreActivityAssay[]>(['ATAC', 'DNase'])

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

  const handleAssayToggle = (assayToToggle: IcreActivityAssay) => {
    if (assays.includes(assayToToggle) && assays.length > 1) {
      setAssays(assays.filter(x => x !== assayToToggle))
    } else if (!assays.includes(assayToToggle)) {
      setAssays([...assays, assayToToggle])
    }
  }

  const AssayRadioButtons = () => {
    return (
      <FormControl>
        <FormLabel id='assay-radio-buttons'>Assay</FormLabel>
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={assays.includes('ATAC')} onChange={() => handleAssayToggle('ATAC')}/>} label="ATAC" />
          <FormControlLabel control={<Checkbox checked={assays.includes('DNase')} onChange={() => handleAssayToggle('DNase')} />} label="DNase" />
        </FormGroup>
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
            assays={assays}
          />
        }
        plots={[
          {
            tabTitle: "Bar Plot",
            plotComponent:
              <IcreActivityBarPlot
                accession={accession}
                selected={selected}
                assays={assays}
                onBarClicked={handleBarClick}
              />
          },
          {
            tabTitle: "UMAP",
            plotComponent:
              <IcreActivityUMAP
                accession={accession}
                assays={assays}
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
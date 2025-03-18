import TwoPaneLayout from "./TwoPaneLayout"
import { GeneExpressionQuery } from "types/generated/graphql"
import { useState } from "react"
import GeneExpressionTable from "./GeneExpressionTable"
import GeneExpressionUMAP from "./GeneExpressionUMAP"
import GeneExpressionBarPlot from "./GeneExpressionBarPlot"
import { Alert, Button } from "@mui/material"
import { Close, ViewList } from "@mui/icons-material"
import GeneExpressionTableNew from "./GeneExpressionTableNEW"
import GeneExpressionDialog from "./GeneExpressionDialog"
import TestComponenet from "./TestComponent"


export type GeneExpressionProps = {
  name: string,
  id: string
}

export type PointMetadata = GeneExpressionQuery["immuneRnaUmapQuery"][0]

const GeneExpression = ({ name, id }: GeneExpressionProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([])
  const [open, setOpen] = useState(false)

  const handlePointsSelected = (pointsInfo: PointMetadata[]) => {
    setSelected([...selected, ...pointsInfo])
  }

  const handleClearSelected = () => {
    setSelected([])
  }

  const handleViewSelected = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSelectionChange = (selected: PointMetadata[]) => {
    setSelected(selected)
  }

  return (
    <>
      {selected.length > 0 ?
        <Alert
          severity="info"
          action={
            <>
              <Button color="inherit" size="small" onClick={handleViewSelected} startIcon={<ViewList />} sx={{mr: 1}}>
                View Selected
              </Button>
              <Button color="inherit" size="small" onClick={handleClearSelected} startIcon={<Close />}>
                Clear
              </Button>
            </>
          }
        >
          {`${selected.length} points selected`}
        </Alert>
        :
        <Alert severity="info" variant="outlined">
          Select experiments to view more information
        </Alert>
      }
    <TwoPaneLayout
      TableComponent={
          <GeneExpressionTableNew
            name={name}
            id={id}
            selected={selected}
            onSelectionChange={handleSelectionChange}
          />
        }
        plots={[
          {
            tabTitle: "Test",
            plotComponent: <TestComponenet />
          },
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
      <GeneExpressionDialog open={open} onClose={handleClose} selected={selected} />
    </>
  )
}

export default GeneExpression
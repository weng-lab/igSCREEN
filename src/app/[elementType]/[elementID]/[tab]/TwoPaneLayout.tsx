import { CloseFullscreenRounded, ExpandMore, MinimizeRounded, TableChartRounded } from "@mui/icons-material"
import { Stack, Accordion, AccordionSummary, AccordionDetails, Box, Typography, Tabs, Tab, useMediaQuery, useTheme, Grid2 as Grid, IconButton, Tooltip, Button } from "@mui/material"
import { useState } from "react"

/**
 * type argument is type of the row object passed to table
 */
export type TwoPaneLayoutProps = {
  TableComponent: React.ReactNode
  plots: {
    tabTitle: string,
    plotComponent: React.ReactNode
  }[]
}

const TwoPaneLayout = ({ TableComponent, plots }: TwoPaneLayoutProps) => {
  const [tab, setTab] = useState<number>(0)
  const [tableOpen, setTableOpen] = useState(true)

  const handleSetTab = (_, newTab: number) => {
    setTab(newTab)
  }

  const handleToggleTable = () => {
    setTableOpen(!tableOpen)
  }

  const plotTabs = plots.map(x => x.tabTitle)
  const figures = plots.map(x => x.plotComponent)

  return (
    <Stack spacing={2} direction={{xs: "column", lg: "row"}} id="two-pane-layout">
      <Box flexGrow={0} width={{xs: '100%', lg: tableOpen ? '35%' : 'initial'}} id="table-container">
        {tableOpen ?
          <>
            <Stack direction={"row"} alignItems={"center"} gap={1} mb={1}>
              <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
                {/* Using negative margin instead of 'edge' prop since, edge gives -12px padding instead of needed -8px for actual alignment */}
                <IconButton onClick={handleToggleTable} sx={{mx: -1}}>
                  <TableChartRounded color="primary" />
                </IconButton>
              </Tooltip>
              <Typography variant="h5" sx={{ flexGrow: 1 }}>Table View</Typography>
              <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
                {/* Using negative margin instead of 'edge' prop since, edge gives -12px padding instead of needed -8px for actual alignment */}
                <IconButton onClick={handleToggleTable} sx={{mx: -1}}>
                  <CloseFullscreenRounded color="primary" />
                </IconButton>
              </Tooltip>
            </Stack>
            <div>
              {TableComponent}
            </div>
          </>
          :
          <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
            {/* Using negative margin instead of 'edge' prop since, edge gives -12px padding instead of needed -8px for actual alignment */}
            <IconButton onClick={handleToggleTable} sx={{mx: -1}}> 
              <TableChartRounded color="primary" />
            </IconButton>
          </Tooltip>
        }
      </Box>
      <Box flexGrow={1} overflow={"hidden"} id="tabs_figure_container">
        <Tabs value={tab} onChange={handleSetTab} sx={{mb: 2}} id="plot_tabs">
          {plotTabs.map((tab, i) =>
            <Tab label={tab} key={i} />)
          }
        </Tabs>
        {figures.map((Figure, i) =>
          <Box display={tab === i ? "block" : "none"} key={i} id={"figure_container"}>
            {Figure}
          </Box>
        )}
      </Box>
    </Stack>
  )
}

export default TwoPaneLayout
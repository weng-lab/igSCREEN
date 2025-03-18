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

  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up("md"))

  return (
    <Stack spacing={2} direction={{xs: "column", md: "row"}} id="two-pane-layout">
      <Box flexGrow={0} width={{xs: '100%', md: tableOpen ? '35%' : '40px'}} id="table-container">
        {tableOpen ?
          <>
            <Stack direction={"row"} alignItems={"center"} spacing={1} mb={1}>
              <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
                <IconButton onClick={handleToggleTable}>
                  <TableChartRounded color="primary" />
                </IconButton>
              </Tooltip>
              <Typography variant="h5" sx={{ flexGrow: 1 }}>Table View</Typography>
              <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
                <IconButton onClick={handleToggleTable}>
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
            <IconButton onClick={handleToggleTable}>
              <TableChartRounded color="primary" />
            </IconButton>
          </Tooltip>
        }
      </Box>
      <Box flexGrow={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={handleSetTab}>
            {plotTabs.map((tab, i) =>
              <Tab label={tab} key={i} />)
            }
          </Tabs>
        </Box>
        {figures.map((Figure, i) =>
          <Box display={tab === i ? "block" : "none"} width={'100%'} key={i} id={"figure_container"}>
            {Figure}
          </Box>
        )}
      </Box>
    </Stack>
  )
}

export default TwoPaneLayout
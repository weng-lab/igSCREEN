import { ExpandMore } from "@mui/icons-material"
import { Stack, Accordion, AccordionSummary, AccordionDetails, Box, Typography, Tabs, Tab, useMediaQuery, useTheme, Grid2 as Grid } from "@mui/material"
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

const TwoPaneLayout = ({TableComponent, plots}: TwoPaneLayoutProps) => {
  const [tab, setTab] = useState<number>(0)
  const handleSetTab = (_, newTab: number) => {
    setTab(newTab)
  }

  const plotTabs = plots.map(x => x.tabTitle)
  const figures = plots.map(x => x.plotComponent)

  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up("md"))

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, lg: 6}} id={"accordion_container"}>
        <Accordion defaultExpanded={isMd}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Table View</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {TableComponent}
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={{xs: 12, lg: 6}} id={"figure+tabs_container"}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} id={"tabs_container"}>
          <Tabs value={tab} onChange={handleSetTab}>
            {plotTabs.map((tab, i) =>
              <Tab label={tab} key={i} />)
            }
          </Tabs>
        </Box>
        {figures.map((Figure, i) =>
          <Box display={tab === i ? "initial" : "none"} key={i} id={"figure_container"}>
            {Figure}
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default TwoPaneLayout
import { ExpandMore } from "@mui/icons-material"
import { Stack, Accordion, AccordionSummary, AccordionDetails, FormControl, InputLabel, MenuItem, Box, Grid2, Typography, Tabs } from "@mui/material"
import { ParentSize } from "@visx/responsive"
import { DataTableProps, ScatterPlot } from "@weng-lab/psychscreen-ui-components"
import { useState } from "react"

/**
 * type argument is type of the row object passed to table
 */
type TwoPaneLayoutProps<T> = {
  TableComponent: React.ComponentType<DataTableProps<T>>,
  plots: {
    tabTitle: string,
    plotComponent: () => React.ReactNode
  }[]
}

const TwoPaneLayout = <T extends object>(props: TwoPaneLayoutProps<T>) => {
  const [tab, setTab] = useState<string>(null)

  return (
    <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Table View</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* {<props.tableComponent/>} */}
          </AccordionDetails>
        </Accordion>
      </div>
      <Stack width={"100%"}>
        <Tabs>

        </Tabs>
        {/* {props.plots.map(({tabTitle, plotComponent}, i) => {
          return <plotComponent key={i} />
        })} */}
      </Stack>
    </Stack>
  )
}
"use client"

import * as React from "react"
import { Tabs, Tab, Box, Container, ThemeProvider } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

import { QuickStart } from "./quick-start"
import { DetailedElements } from "./detailed-elements"
import { DataMatrices } from "./data-matrices"
import { useMemo, useState } from "react"
import { defaultTheme } from "../../common/lib/themes"
import { useRouter } from "next/navigation"
import { ApolloQueryResult } from "@apollo/client"

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export default function DownloadsPage(props: {
  biosamples: -1 | ApolloQueryResult<any>
  matrices: -1 | ApolloQueryResult<any>
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [page, setPage] = useState(props.searchParams.tab ? Number(props.searchParams.tab) : 0)
  const [matricesState, setMatricesState] = useState<{
    assembly: "Human" | "Mouse"
    assay: "DNase" | "H3K4me3" | "H3K27ac" | "CTCF"
  } | null>(null)

  const router = useRouter()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (
      (props.searchParams.assembly === "Human" || props.searchParams.assembly === "Mouse") &&
      (props.searchParams.assay === "DNase" ||
        props.searchParams.assay === "H3K4me3" ||
        props.searchParams.assay === "H3K27ac" ||
        props.searchParams.assay === "CTCF")
    ) {
      setMatricesState({ assembly: props.searchParams.assembly, assay: props.searchParams.assay })
    }
    if (newValue === 2 && matricesState !== null) {
      router.push(`/downloads?tab=${newValue}&assembly=${matricesState.assembly}&assay=${matricesState.assay}`)
    } else {
      router.push(`/downloads?tab=${newValue}`)
    }
    setPage(newValue)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container>
        <Grid2 mt={2} container spacing={2}>
          <Grid2 xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={page} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Quick Start" sx={{ textTransform: "none" }} {...a11yProps(0)} />
                <Tab label="Detailed Elements" sx={{ textTransform: "none" }} {...a11yProps(1)} />
                <Tab label="Data Matrices" sx={{ textTransform: "none" }} {...a11yProps(2)} />
              </Tabs>
            </Box>
          </Grid2>
          <Grid2 xs={12}>
            <QuickStart value={page} biosamples={props.biosamples} />
            <DetailedElements value={page} biosamples={props.biosamples} />
            {/* Matrices being fed biosamples might be redundant */}
            <DataMatrices value={page} biosamples={props.biosamples} matrices={props.matrices} searchParams={props.searchParams} />
          </Grid2>
        </Grid2>
      </Container>
    </ThemeProvider>
  )
}

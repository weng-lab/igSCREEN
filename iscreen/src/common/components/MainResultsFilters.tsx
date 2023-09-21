"use client"
import * as React from "react"

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Tooltip,
} from "@mui/material"

import SendIcon from "@mui/icons-material/Send"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

import Grid2 from "@mui/material/Unstable_Grid2"

import Link from "next/link"

import { RangeSlider, DataTable } from "@weng-lab/psychscreen-ui-components"
import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CellTypeData, FilteredBiosampleData, MainQueryParams, UnfilteredBiosampleData } from "../../app/search/types"
import { outputT_or_F, parseByCellType, filterBiosamples, assayHoverInfo, constructURL } from "../lib/filter-helpers"

//Need to go back and define the types in mainQueryParams object
export default function MainResultsFilters(props: { mainQueryParams: MainQueryParams; byCellType: CellTypeData }) {
  //No alternatives provided for default, as all these attributes should exist and are given a default value in Search's page.tsx

  //Biosample Filter
  const [CellLine, setCellLine] = useState<boolean>(props.mainQueryParams.CellLine)
  const [PrimaryCell, setPrimaryCell] = useState<boolean>(props.mainQueryParams.PrimaryCell)
  const [Tissue, setTissue] = useState<boolean>(props.mainQueryParams.Tissue)
  const [Organoid, setOrganoid] = useState<boolean>(props.mainQueryParams.Organoid)
  const [InVitro, setInVitro] = useState<boolean>(props.mainQueryParams.InVitro)
  //Selected Biosample
  const [Biosample, setBiosample] = useState<{
    selected: boolean
    biosample: string | null
    tissue: string | null
    summaryName: string | null
  }>(props.mainQueryParams.Biosample)
  const [BiosampleHighlight, setBiosampleHighlight] = useState<{} | null>(null)
  const [SearchString, setSearchString] = useState<string>("")

  //Chromatin Filter
  const [DNaseStart, setDNaseStart] = useState<number>(props.mainQueryParams.dnase_s)
  const [DNaseEnd, setDNaseEnd] = useState<number>(props.mainQueryParams.dnase_e)
  const [H3K4me3Start, setH3K4me3Start] = useState<number>(props.mainQueryParams.h3k4me3_s)
  const [H3K4me3End, setH3K4me3End] = useState<number>(props.mainQueryParams.h3k4me3_e)
  const [H3K27acStart, setH3K27acStart] = useState<number>(props.mainQueryParams.h3k27ac_s)
  const [H3K27acEnd, setH3K27acEnd] = useState<number>(props.mainQueryParams.h3k27ac_e)
  const [CTCFStart, setCTCFStart] = useState<number>(props.mainQueryParams.ctcf_s)
  const [CTCFEnd, setCTCFEnd] = useState<number>(props.mainQueryParams.ctcf_e)

  //Classification Filter
  const [CA, setCA] = useState<boolean>(props.mainQueryParams.CA)
  const [CA_CTCF, setCA_CTCF] = useState<boolean>(props.mainQueryParams.CA_CTCF)
  const [CA_H3K4me3, setCA_H3K4me3] = useState<boolean>(props.mainQueryParams.CA_H3K4me3)
  const [CA_TF, setCA_TF] = useState<boolean>(props.mainQueryParams.CA_TF)
  const [dELS, setdELS] = useState<boolean>(props.mainQueryParams.dELS)
  const [pELS, setpELS] = useState<boolean>(props.mainQueryParams.pELS)
  const [PLS, setPLS] = useState<boolean>(props.mainQueryParams.PLS)
  const [TF, setTF] = useState<boolean>(props.mainQueryParams.TF)

  const urlParams = {
    Tissue,
    PrimaryCell,
    InVitro,
    Organoid,
    CellLine,
    Biosample: {
      selected: Biosample.selected,
      biosample: Biosample.biosample,
      tissue: Biosample.tissue,
      summaryName: Biosample.summaryName,
    },
    DNaseStart,
    DNaseEnd,
    H3K4me3Start,
    H3K4me3End,
    H3K27acStart,
    H3K27acEnd,
    CTCFStart,
    CTCFEnd,
    CA,
    CA_CTCF,
    CA_H3K4me3,
    CA_TF,
    dELS,
    pELS,
    PLS,
    TF,
  }

  const router = useRouter()

  /**
   * Biosample Tables, only re-rendered if the relevant state variables change. Prevents sluggish sliders in other filters
   */
  const biosampleTables = useMemo(
    () => {
      const filteredBiosamples: FilteredBiosampleData = filterBiosamples(
        parseByCellType(props.byCellType),
        Tissue,
        PrimaryCell,
        CellLine,
        InVitro,
        Organoid
      )
      const cols = [
        {
          header: "Biosample",
          value: (row) => row.summaryName,
          render: (row) => (
            <Tooltip title={"Biosample Type: " + row.biosampleType} arrow>
              <Typography variant="body2">{row.summaryName}</Typography>
            </Tooltip>
          ),
        },
        {
          header: "Assays",
          value: (row) => Object.keys(row.assays).filter((key) => row.assays[key] === true).length,
          render: (row) => {
            const fifth = (2 * 3.1416 * 10) / 5
            return (
              <Tooltip title={assayHoverInfo(row.assays)} arrow>
                <svg height="50" width="50" viewBox="0 0 50 50">
                  <circle r="20.125" cx="25" cy="25" fill="#EEEEEE" stroke="black" strokeWidth="0.25" />
                  <circle
                    r="10"
                    cx="25"
                    cy="25"
                    fill="transparent"
                    stroke={`${row.assays.dnase ? "#06DA93" : "transparent"}`}
                    strokeWidth="20"
                    strokeDasharray={`${fifth} ${fifth * 4}`}
                  />
                  <circle
                    r="10"
                    cx="25"
                    cy="25"
                    fill="transparent"
                    stroke={`${row.assays.h3k27ac ? "#FFCD00" : "transparent"}`}
                    strokeWidth="20"
                    strokeDasharray={`${fifth * 0} ${fifth} ${fifth} ${fifth * 3}`}
                  />
                  <circle
                    r="10"
                    cx="25"
                    cy="25"
                    fill="transparent"
                    stroke={`${row.assays.h3k4me3 ? "#FF0000" : "transparent"}`}
                    strokeWidth="20"
                    strokeDasharray={`${fifth * 0} ${fifth * 2} ${fifth} ${fifth * 2}`}
                  />
                  <circle
                    r="10"
                    cx="25"
                    cy="25"
                    fill="transparent"
                    stroke={`${row.assays.ctcf ? "#00B0F0" : "transparent"}`}
                    strokeWidth="20"
                    strokeDasharray={`${fifth * 0} ${fifth * 3} ${fifth} ${fifth * 1}`}
                  />
                  <circle
                    r="10"
                    cx="25"
                    cy="25"
                    fill="transparent"
                    stroke={`${row.assays.atac ? "#02C7B9" : "transparent"}`}
                    strokeWidth="20"
                    strokeDasharray={`${fifth * 0} ${fifth * 4} ${fifth}`}
                  />
                </svg>
              </Tooltip>
            )
          },
        },
      ]

      return filteredBiosamples.sort().map((tissue: [string, {}[]], i) => {
        // If user enters a search, check to see if the tissue name matches
        if (tissue[0].includes(SearchString)) {
          return (
            <Accordion key={tissue[0]}>
              <AccordionSummary
                expandIcon={<KeyboardArrowRightIcon />}
                sx={{
                  flexDirection: "row-reverse",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Typography>{tissue[0][0].toUpperCase() + tissue[0].slice(1)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DataTable
                  columns={cols}
                  rows={tissue[1]}
                  dense
                  searchable
                  highlighted={BiosampleHighlight}
                  sortColumn={1}
                  onRowClick={(row, i) => {
                    setBiosample({ selected: true, biosample: row.queryValue, tissue: row.biosampleTissue, summaryName: row.summaryName })
                    setBiosampleHighlight(row)
                    //Push to router with new biosample to avoid accessing stale Biosample value
                    router.push(
                      constructURL(props.mainQueryParams, urlParams, {
                        selected: true,
                        biosample: row.queryValue,
                        tissue: row.biosampleTissue,
                        summaryName: row.summaryName,
                      })
                    )
                  }}
                />
              </AccordionDetails>
            </Accordion>
          )
        }
      })
    },
    // Linter wants to include biosampleTables here as a dependency. Including it breaks intended functionality. Revisit later?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [CellLine, InVitro, Organoid, PrimaryCell, Tissue, BiosampleHighlight, SearchString, props.byCellType, props.mainQueryParams]
  )

  //Need to make this more responsive
  return (
    <Paper elevation={4}>
      <Box sx={{ minHeight: "64px", display: "flex", alignItems: "center" }}>
        <Typography variant="h5" sx={{ pl: "16px" }}>
          Refine Your Search
        </Typography>
      </Box>
      {/* Biosample Activity */}
      <Accordion square defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Biosample Activity</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid2 container spacing={2}>
            <Grid2 xs={6}>
              <Typography>Tissue/Organ</Typography>
            </Grid2>
            <Grid2 xs={6}>
              <TextField
                value={SearchString}
                size="small"
                label="Filter Tissues"
                onChange={(event) => setSearchString(event.target.value)}
              />
            </Grid2>
            {Biosample.selected && (
              <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                  <Paper elevation={0}>
                    <Typography>Selected Biosample:</Typography>
                    <Typography>{Biosample.tissue[0].toUpperCase() + Biosample.tissue.slice(1) + " - " + Biosample.summaryName}</Typography>
                  </Paper>
                </Grid2>
                <Grid2 xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setBiosample({ selected: false, biosample: null, tissue: null, summaryName: null })
                      setBiosampleHighlight(null)
                      router.push(
                        constructURL(props.mainQueryParams, urlParams, {
                          selected: false,
                          biosample: null,
                          tissue: null,
                          summaryName: null,
                        })
                      )
                    }}
                  >
                    Clear
                  </Button>
                </Grid2>
              </Grid2>
            )}
            <Grid2 xs={12} maxHeight={500} overflow={"auto"}>
              {biosampleTables}
            </Grid2>
            <Grid2 xs={12} sx={{ mt: 1 }}>
              <Typography>Biosample Type</Typography>
              <FormGroup>
                <FormControlLabel
                  checked={Tissue}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setTissue(checked)}
                  control={<Checkbox />}
                  label="Tissue"
                />
                <FormControlLabel
                  checked={PrimaryCell}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setPrimaryCell(checked)}
                  control={<Checkbox />}
                  label="Primary Cell"
                />
                <FormControlLabel
                  checked={InVitro}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setInVitro(checked)}
                  control={<Checkbox />}
                  label="In Vitro Differentiated Cell"
                />
                <FormControlLabel
                  checked={Organoid}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setOrganoid(checked)}
                  control={<Checkbox />}
                  label="Organoid"
                />
                <FormControlLabel
                  checked={CellLine}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setCellLine(checked)}
                  control={<Checkbox />}
                  label="Cell Line"
                />
              </FormGroup>
            </Grid2>
          </Grid2>
        </AccordionDetails>
      </Accordion>
      {/* Chromatin Signals */}
      <Accordion square disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography>Chromatin Signals (Z-Scores)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid2 container spacing={3}>
            <Grid2 xs={6} lg={12} xl={6}>
              <RangeSlider
                title="DNase"
                width="100%"
                defaultStart={DNaseStart}
                defaultEnd={DNaseEnd}
                min={-10}
                max={10}
                minDistance={1}
                step={0.1}
                //These are not properly typed due to an issue in the component library. Type properly when fixed
                onChange={(value: any) => {
                  setDNaseStart(value[0])
                  setDNaseEnd(value[1])
                }}
              />
            </Grid2>
            <Grid2 xs={6} lg={12} xl={6}>
              <RangeSlider
                title="H3K4me3"
                width="100%"
                defaultStart={H3K4me3Start}
                defaultEnd={H3K4me3End}
                min={-10}
                max={10}
                minDistance={1}
                step={0.1}
                onChange={(value: any) => {
                  setH3K4me3Start(value[0])
                  setH3K4me3End(value[1])
                }}
              />
            </Grid2>
            <Grid2 xs={6} lg={12} xl={6}>
              <RangeSlider
                title="H3K27ac"
                width="100%"
                defaultStart={H3K27acStart}
                defaultEnd={H3K27acEnd}
                min={-10}
                max={10}
                minDistance={1}
                step={0.1}
                onChange={(value: any) => {
                  setH3K27acStart(value[0])
                  setH3K27acEnd(value[1])
                }}
              />
            </Grid2>
            <Grid2 xs={6} lg={12} xl={6}>
              <RangeSlider
                title="CTCF"
                width="100%"
                defaultStart={CTCFStart}
                defaultEnd={CTCFEnd}
                min={-10}
                max={10}
                minDistance={1}
                step={0.1}
                onChange={(value: any) => {
                  setCTCFStart(value[0])
                  setCTCFEnd(value[1])
                }}
              />
            </Grid2>
          </Grid2>
        </AccordionDetails>
      </Accordion>
      {/* Classification */}
      <Accordion square disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
          <Typography>Classification</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>cCRE Classes</Typography>
          <Grid2 container spacing={0}>
            <Grid2 xs={6} sm={6} xl={6}>
              <FormGroup>
                <FormControlLabel
                  checked={CA}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setCA(checked)}
                  control={<Checkbox />}
                  label="CA"
                />
                <FormControlLabel
                  checked={CA_CTCF}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setCA_CTCF(checked)}
                  control={<Checkbox />}
                  label="CA-CTCF"
                />
                <FormControlLabel
                  checked={CA_H3K4me3}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setCA_H3K4me3(checked)}
                  control={<Checkbox />}
                  label="CA-H3K4me3"
                />
                <FormControlLabel
                  checked={CA_TF}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setCA_TF(checked)}
                  control={<Checkbox />}
                  label="CA-TF"
                />
              </FormGroup>
            </Grid2>
            <Grid2 xs={6} sm={6} xl={6}>
              <FormGroup>
                <FormControlLabel
                  checked={dELS}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setdELS(checked)}
                  control={<Checkbox />}
                  label="dELS"
                />
                <FormControlLabel
                  checked={pELS}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setpELS(checked)}
                  control={<Checkbox />}
                  label="pELS"
                />
                <FormControlLabel
                  checked={PLS}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setPLS(checked)}
                  control={<Checkbox />}
                  label="PLS"
                />
                <FormControlLabel
                  checked={TF}
                  onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setTF(checked)}
                  control={<Checkbox />}
                  label="TF"
                />
              </FormGroup>
            </Grid2>
          </Grid2>
        </AccordionDetails>
      </Accordion>
      {/* Linked Genes */}
      <Accordion square disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
          <Typography>Linked Genes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* Functional Characterization */}
      <Accordion square disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5a-content" id="panel5a-header">
          <Typography>Functional Characterization</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* Conservation */}
      <Accordion square disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6a-content" id="panel6a-header">
          <Typography>Conservation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Link href={constructURL(props.mainQueryParams, urlParams)}>
        <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: "16px", mb: "16px", ml: "16px", mr: "16px" }}>
          Filter Results
        </Button>
      </Link>
    </Paper>
  )
}

"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { StyledTab } from "../../common/utils"
import { client } from "../../common/utils"
import SearchIcon from "@mui/icons-material/Search"
import { Box, CircularProgress, Collapse, List, ListItemButton, ListItemText, Stack, ToggleButtonGroup, Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { TextField, IconButton, InputAdornment } from "@mui/material"
import { FormControl, MenuItem } from "@mui/material"
import { ApolloError, useQuery } from "@apollo/client"

import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { GenomeBrowserView } from "../../common/gbview/genomebrowserview"
import { CcreAutoComplete } from "../../common/components/mainsearch/CcreAutocomplete"
import { DataTable } from "@weng-lab/psychscreen-ui-components"

import { IcresByRegion } from "./icresbyregion"
import { ATAC_UMAP_QUERY, EBI_ASSO_QUERY, ICRES_ACTIVE_EXPERIMENTS, ICRES_BYCT_ZSCORES_QUERY, ICRES_CT_ZSCORES_QUERY, ICRES_QUERY } from "./queries"
import InputLabel from "@mui/material/InputLabel";
import { stringToColour } from "../../common/utils";
import { AtacBarPlot } from "./atacbarplot"
import { cellTypeStaticInfo } from "../../common./../common/consts";
import { UmapPlot } from "../../common/components/umapplot";
import CellTypeTree from "../../common/components/cellTypeTree"
import { generateCellLineageTreeState, getCellColor, getCellDisplayName } from "../celllineage/utils"


//Need better text styling
import ToggleButton from '@mui/material/ToggleButton';
import { Experiment_Data } from "./types"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { ActiveCellTypesList, ActiveExperimentList } from "./utils"


export default function Icres() {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  const router = useRouter()
  const [searchvalue, setSearchValue] = useState("")
  const [selectedPortal, setSelectedPortal] = useState<string>("Genomic Region");
  const [tabVal, setTabVal] = useState<"Aggregate" | "Calderon" | "Corces">("Aggregate")
  const [colorScheme, setcolorScheme] = useState('ZScore');

  const handleColorSchemeChange = (
    event: React.MouseEvent<HTMLElement>,
    newScheme: string,
  ) => {
    setcolorScheme(newScheme);
  };
  const handleSelectedPortal = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };

  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }
  const handleTabChange = (_, newValue: "Aggregate" | "Calderon" | "Corces") => {
    setTabVal(newValue)
  }
  const handleSearchChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSearchValue(event.target.value)
  }

  /**
   * 
   * @todo replace this with the updated region parsing code from SCREEN 2.0. Should make the genomic region input a component in library
   */
  function handleSubmit() {
    //if submitted with empty value, use default search
    if (searchvalue == "") {
      router.push(`/icres?chromosome=chr11&start=5205263&end=5381894`)
      return
    }
    const input = searchvalue.split(":")
    const chromosome = input[0]
    const coordinates = input[1].split("-")
    const start = coordinates[0]
    const end = coordinates[1]
    router.push(`/icres?chromosome=${chromosome}&start=${start}&end=${end}`)
  }

  const { loading: atacumaploading, data: atacumapdata } = useQuery(ATAC_UMAP_QUERY, {
    variables: {
      accession: searchParams.get("accession")
    },
    skip: !searchParams.get("accession"),
    client,
  })

  const { loading: icrezscoreloading, data: icrezscoredata } = useQuery(ICRES_CT_ZSCORES_QUERY, {
    variables: {
      accession: searchParams.get('accession'),
      study: [tabVal]
    },
    skip: !searchParams.get('accession') || tabVal === "Aggregate",
    client,
  })

  const { loading: icrebyctzscoreloading, data: icrebyctzscoredata } = useQuery(ICRES_BYCT_ZSCORES_QUERY, {
    variables: {
      accession: searchParams.get('accession'),
    },
    skip: !searchParams.get('accession'),
    client,
  })

  const { loading: aloading, data: adata, error: error_adata } = useQuery(ICRES_QUERY, {
    variables: {
      accession: searchParams.get('accession')
    },
    skip: !(searchParams && searchParams.get("accession")),
    client,
  })

  const { loading: loading_experiments, data: data_experiments, error: error_experiments }: { loading: boolean, data: { calderoncorcesAtacQuery: Experiment_Data[] }, error?: ApolloError } = useQuery(ICRES_ACTIVE_EXPERIMENTS, {
    variables: {
      accession: searchParams.get('accession') ? [searchParams.get('accession')] : []
    },
    skip: !searchParams.get('accession'),
    client,
  })

  //Parse experiment info
  let activeExps: { [key: string]: Experiment_Data[] } = {}
  data_experiments?.calderoncorcesAtacQuery.forEach(exp => {
    //Cutoff for experiment activity set at 1.64
    if (exp.value > 1.64) {
      if (activeExps[exp.grouping]) {
        activeExps[exp.grouping] = [...activeExps[exp.grouping], exp]
      } else {
        activeExps[exp.grouping] = [exp]
      }
    }
  });


  let barplotdata = icrezscoredata && icrezscoredata.calderoncorcesAtacQuery.map(ic => {
    return {
      ...ic,
      color: getCellColor(ic.celltype),
      value: ic.value
    }
  })


  let barplotbyctdata = icrebyctzscoredata && icrebyctzscoredata.calderoncorcesByCtAtacQuery.map(ic => {
    return {
      ...ic,
      color: getCellColor(ic.celltype),
      value: ic.value

    }
  })

  barplotdata = !icrezscoreloading && icrezscoredata && icrezscoredata.calderoncorcesAtacQuery.length > 0 && barplotdata.sort((a, b) => a.order - b.order);
  barplotbyctdata = !icrebyctzscoreloading && icrebyctzscoredata && icrebyctzscoredata.calderoncorcesByCtAtacQuery.length > 0 && barplotbyctdata.sort((a, b) => a.order - b.order);

  const { data: ebidata } = useQuery(EBI_ASSO_QUERY, {
    variables: {
      accession: searchParams.get('accession')
    },
    skip: !searchParams.get('accession'),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })


  return !searchParams.get('accession') && !searchParams.get('chromosome') ? (
    <main>
      <Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
        <Grid2 xs={6}>
          <Typography variant="h3">iCRE Portal</Typography>
          <br />
          <FormControl variant="standard">
            <Select
              id="portal_Select"
              value={selectedPortal}
              // defaultValue={10}
              onChange={handleSelectedPortal}
            >
              <MenuItem value={"Genomic Region"}>Genomic Region</MenuItem>
              <MenuItem value={"iCREs"}>iCREs</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          {selectedPortal === "Genomic Region" ?
            <TextField
              variant="outlined"
              InputLabelProps={{ shrink: true, style: { color: "black" } }}
              label="Enter a genomic region in form chr:start-end."
              placeholder="chr11:5205263-5381894"
              value={searchvalue}
              onChange={handleSearchChange}
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  handleSubmit()
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ color: "black" }}>
                    <IconButton aria-label="Search" type="submit" onClick={() => handleSubmit()} sx={{ color: "black" }}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: "black" },
              }}
              sx={{ mr: "1em", ml: "1em", fieldset: { borderColor: "black" } }}
            />
            : <CcreAutoComplete textColor={"black"} assembly={"GRCh38"} />
          }
        </Grid2>
      </Grid2>
    </main>) : searchParams.get('chromosome') ? (
      <IcresByRegion />
    ) : (
    <main>
      <Grid2 container sx={{ maxWidth: "90%", mr: "auto", ml: "auto", mt: "3rem" }}>
        <Grid2 container sx={{ ml: "0.5em", mt: "4rem", mb: "2rem" }}>
          <Grid2 xs={12} lg={12}>
            {searchParams.get("accession") && <Typography variant="h4">Accession Details: {searchParams.get("accession")}</Typography>}
          </Grid2>
          <Grid2 xs={12} lg={12}>
            <Tabs aria-label="icres_tabs" value={value} onChange={handleChange}>
              <StyledTab value={0} label="Genome Browser" />
              <StyledTab value={1} label="Activity UMAP" />
              {/* <StyledTab value={2} label="GWAS Associations" /> */}
              <StyledTab value={3} label="Cell Type Specific Activity" />
              <StyledTab value={4} label="Activity in Cell Lineage" />
            </Tabs>
          </Grid2>
        </Grid2>
        {value === 0 && adata &&
          <Grid2 xs={12} lg={12}>
            <GenomeBrowserView
              accession={
                {
                  name: adata.iCREQuery[0].accession,
                  start: adata.iCREQuery[0].coordinates.start,
                  end: adata.iCREQuery[0].coordinates.end,
                }
              }
              assembly={"GRCh38"}
              coordinates={{ start: adata.iCREQuery[0].coordinates.start, end: adata.iCREQuery[0].coordinates.end, chromosome: adata.iCREQuery[0].coordinates.chromosome }}
              defaultcelltypes={adata.iCREQuery[0].celltypes}
            />
          </Grid2>
        }
        {value === 1 && searchParams.get("accession") && !atacumaploading && atacumapdata && atacumapdata.calderonAtacUmapQuery.length > 0 &&

          <Grid2 xs={12} lg={12}>
            Color Scheme:
            <br /><br />
            <ToggleButtonGroup
              color="primary"
              value={colorScheme}
              exclusive

              onChange={handleColorSchemeChange}
              aria-label="Platform"
            >
              <ToggleButton sx={{textTransform: 'none'}} value="ZScore">Z-score</ToggleButton>
              <ToggleButton sx={{textTransform: 'none'}} value="celltype">Cell Type Cluster</ToggleButton>
            </ToggleButtonGroup>
            <br />
            <br />
            <UmapPlot colorScheme={colorScheme} data={atacumapdata.calderonAtacUmapQuery} plottitle={"Z-score"} />
          </Grid2>
        }
        {value === 2 && ebidata &&
          <Grid2 container>
            <Grid2 xs={12} lg={12}>
              <DataTable
                columns={[
                  {
                    header: "Chromosome",
                    value: (row) => row.chromosome,
                  },
                  {
                    header: "Position",
                    value: (row) => row.position,
                  },
                  {
                    header: "Strongest snp risk allele",
                    value: (row) => row.strongest_snp_risk_allele,
                  },
                  {
                    header: "Risk Allele Frequency",
                    value: (row) => row.risk_allele_frequency,

                  },
                  {
                    header: "P",
                    HeaderRender: () => <Typography variant="body2"><i>P</i></Typography>,
                    value: (row) => row.p_value && row.p_value || 0,
                  },
                  {
                    header: "Study",
                    value: (row) => row.study,
                  },
                  {
                    header: "Region",
                    value: (row) => row.region,
                  },
                  {
                    header: "Immu screen trait",
                    value: (row) => row.immu_screen_trait
                  },
                  {
                    header: "mapped_trait",
                    value: (row) => row.mapped_trait
                  },
                  {
                    header: "Pubmed Id",
                    value: (row) => row.pubmedid

                  }

                ]}
                tableTitle={`EBI Associations for ${searchParams.get('accession')}:`}
                rows={ebidata.ebiAssociationsQuery || []}


                itemsPerPage={10}
              />
            </Grid2>
          </Grid2>
        }
        {value === 3 &&
          <Grid2 xs={12} lg={12}>
            <Tabs aria-label="icres_tabs" value={tabVal} onChange={handleTabChange}>
              <StyledTab value="Aggregate" label="Aggregate ATAC by Celltype" />
              <StyledTab value="Calderon" label="Study: Calderon" />
              <StyledTab value="Corces" label="Study: Corces" />
            </Tabs>
            {tabVal === "Aggregate" && (
              icrebyctzscoreloading ?
                <CircularProgress />
                :
                icrebyctzscoredata?.calderoncorcesByCtAtacQuery.length > 0 && barplotbyctdata &&
                <Grid2 container>
                  <Grid2 xs={12} lg={12}>
                    <AtacBarPlot study={tabVal} barplotdata={barplotbyctdata} />
                  </Grid2>
                </Grid2>
            )}
            {(tabVal === "Calderon" || tabVal === "Corces") && (
              icrezscoreloading ?
                <CircularProgress />
                :
                icrezscoredata?.calderoncorcesAtacQuery.length > 0 && barplotdata &&
                <AtacBarPlot study={tabVal} barplotdata={barplotdata} />
            )}
          </Grid2>
        }
        {value === 4 &&
          (aloading ?
            <CircularProgress />
            :
            <Stack rowGap={2}>
              <Stack direction={"row"}>
                {
                  aloading ? <CircularProgress />
                    : error_adata ? <Typography>Something went wrong fetching activity in cell types</Typography>
                      : <Box maxWidth={500}><ActiveCellTypesList celltypes={adata?.iCREQuery[0].celltypes} /></Box>
                }
                {
                  loading_experiments ? <CircularProgress />
                    : error_experiments ? <Typography>Something went wrong fetching activity in individual experiments</Typography>
                      : <Box maxWidth={500}><ActiveExperimentList activeExps={activeExps} /></Box>
                }
              </Stack>
              <CellTypeTree
                width={830}
                height={1100}
                orientation="vertical"
                cellTypeState={generateCellLineageTreeState(adata?.iCREQuery[0].celltypes || [], false)}
                noneSelectedOpacity='translucent'
              />
            </Stack>
          )
        }
      </Grid2>
    </main>
  )
}

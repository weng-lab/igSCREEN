"use client"
import React, { useState } from "react"
import { toScientificNotation } from "common/utils"
import { Box, CircularProgress, Stack, Tab, ToggleButtonGroup, Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import Grid2 from "@mui/material/Grid2"
import { ApolloError, useQuery } from "@apollo/client"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { ATAC_UMAP_QUERY, EBI_ASSO_QUERY, ICRES_ACTIVE_EXPERIMENTS, ICRES_BYCT_ZSCORES_QUERY, ICRES_CT_ZSCORES_QUERY, ICRES_QUERY } from "./queries"
import { AtacBarPlot } from "./atacbarplot"
import { UmapPlot } from "common/components/umapplot";
import CellTypeTree from "common/components/cellTypeTree"
import { generateCellLineageTreeState, getCellColor, getCellDisplayName } from "app/celllineage/utils"

//Need better text styling
import ToggleButton from '@mui/material/ToggleButton';
import { Experiment_Data } from "./types"
import { ActiveCellTypesList, ActiveExperimentList } from "./utils"


type IcreActivityProps = {
  accession: string
}

const IcreActivity = ({ accession }: IcreActivityProps) => {
  const [value, setValue] = useState(1)
  const [tabVal, setTabVal] = useState<"Aggregate" | "Calderon" | "Corces">("Aggregate")
  const [colorScheme, setcolorScheme] = useState('ZScore');

  const handleColorSchemeChange = (
    event: React.MouseEvent<HTMLElement>,
    newScheme: string,
  ) => {
    setcolorScheme(newScheme);
  }

  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }
  const handleTabChange = (_, newValue: "Aggregate" | "Calderon" | "Corces") => {
    setTabVal(newValue)
  }

  const { loading: atacumaploading, data: atacumapdata } = useQuery(ATAC_UMAP_QUERY, {
    variables: {
      accession
    }
  })

  const { loading: icrezscoreloading, data: icrezscoredata } = useQuery(ICRES_CT_ZSCORES_QUERY, {
    variables: {
      accession,
      study: [tabVal]
    }
  })

  const { loading: icrebyctzscoreloading, data: icrebyctzscoredata } = useQuery(ICRES_BYCT_ZSCORES_QUERY, {
    variables: {
      accession,
    }
  })

  const { loading: aloading, data: adata, error: error_adata } = useQuery(ICRES_QUERY, {
    variables: {
      accession,
    }
  })

  const { loading: loading_experiments, data: data_experiments, error: error_experiments }: { loading: boolean, data: { calderoncorcesAtacQuery: Experiment_Data[] }, error?: ApolloError } = useQuery(ICRES_ACTIVE_EXPERIMENTS, {
    variables: {
      accession: [accession]
    }
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
      accession
    }
  })


  return (
    <Grid2 container>
      <Grid2 container sx={{mb: 2}}>
        <Grid2
          size={{
            xs: 12,
            lg: 12
          }}>
          <Tabs aria-label="icres_tabs" value={value} onChange={handleChange}>
            <Tab value={1} label="Activity UMAP" />
              {/* <Tab value={2} label="GWAS Associations" /> */}
            <Tab value={3} label="Cell Type Specific Activity" />
            <Tab value={4} label="Activity in Cell Lineage" />
          </Tabs>
        </Grid2>
      </Grid2>
      {value === 1 && !atacumaploading && atacumapdata && atacumapdata.calderonAtacUmapQuery.length > 0 &&
        <Grid2
          size={{
            xs: 12,
            lg: 12
          }}>
          Color Scheme:
          <br /><br />
          <ToggleButtonGroup
            color="primary"
            value={colorScheme}
            exclusive

            onChange={handleColorSchemeChange}
            aria-label="Platform"
          >
            <ToggleButton sx={{ textTransform: 'none' }} value="ZScore">Z-score</ToggleButton>
            <ToggleButton sx={{ textTransform: 'none' }} value="celltype">Cell Type Cluster</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <br />
          <UmapPlot colorScheme={colorScheme} data={atacumapdata.calderonAtacUmapQuery} plottitle={"Z-score"} />
        </Grid2>
      }
      {value === 2 && ebidata &&
        <Grid2 container>
          <Grid2
            size={{
              xs: 12,
              lg: 12
            }}>
            <DataTable
              columns={[
                {
                  header: "Chromosome",
                  value: (row: any) => row.chromosome,
                },
                {
                  header: "Position",
                  value: (row: any) => row.position,
                },
                {
                  header: "Strongest snp risk allele",
                  value: (row: any) => row.strongest_snp_risk_allele,
                },
                {
                  header: "Risk Allele Frequency",
                  value: (row: any) => row.risk_allele_frequency,

                },
                {
                  header: "P",
                  HeaderRender: () => <Typography variant="body2"><i>P</i></Typography>,
                  value: (row: any) => row.p_value && toScientificNotation(row.p_value, 2) || 0,
                },
                {
                  header: "Study",
                  value: (row: any) => row.study,
                },
                {
                  header: "Region",
                  value: (row: any) => row.region,
                },
                {
                  header: "Immu screen trait",
                  value: (row: any) => row.immu_screen_trait
                },
                {
                  header: "mapped_trait",
                  value: (row: any) => row.mapped_trait
                },
                {
                  header: "Pubmed Id",
                  value: (row: any) => row.pubmedid

                }

              ]}
              tableTitle={`EBI Associations for ${accession}:`}
              rows={ebidata.ebiAssociationsQuery || []}


              itemsPerPage={10}
            />
          </Grid2>
        </Grid2>
      }
      {value === 3 &&
        <Grid2
          size={{
            xs: 12,
            lg: 12
          }}>
          <Tabs aria-label="icres_tabs" value={tabVal} onChange={handleTabChange}>
            <Tab value="Aggregate" label="Aggregate ATAC by Celltype" />
            <Tab value="Calderon" label="Study: Calderon" />
            <Tab value="Corces" label="Study: Corces" />
          </Tabs>
          {tabVal === "Aggregate" && (
            icrebyctzscoreloading ?
              <CircularProgress />
              :
              icrebyctzscoredata?.calderoncorcesByCtAtacQuery.length > 0 && barplotbyctdata &&
              <Grid2 container>
                <Grid2
                  size={{
                    xs: 12,
                    lg: 12
                  }}>
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
          <Grid2
          size={{
            xs: 12,
            lg: 12
          }}>
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
          </Grid2>
        )
      }
    </Grid2>
  )
}

export default IcreActivity
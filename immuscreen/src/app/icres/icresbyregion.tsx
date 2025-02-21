
import { client } from "../../common/utils"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import React, { useState } from "react"
import { ApolloError, useQuery } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams, useRouter } from "next/navigation"
import Grid2 from "@mui/material/Grid2"
import { StyledTab } from "../../common/utils"
import { CircularProgress, Collapse, List, ListItemButton, ListItemText, Stack, Tooltip, Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import { ICRES_ACTIVE_EXPERIMENTS, ICRES_QUERY } from "./queries"
import { experimentInfo } from "../../common/consts"
import { getCellDisplayName } from "../celllineage/utils"
import { ExpandLess, ExpandMore, InfoOutlined } from "@mui/icons-material"
import { ICRE_Data, Experiment_Data } from "./types"
import { ActiveCellTypesList, ActiveExperimentList } from "./utils"

export const IcresByRegion = (props) => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  const router = useRouter()
  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }

  const { loading: loading_icres, data: data_icres, error: error_icres }: { loading: boolean, data: { iCREQuery: ICRE_Data[] }, error?: ApolloError } = useQuery(ICRES_QUERY, {
    variables: {
      coordinates: {
        chromosome: searchParams.get("chromosome"),
        start: +searchParams.get("start")!!,
        end: +searchParams.get("end")!!
      }
    },
    skip: !searchParams.get("chromosome"),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  const { loading: loading_experiments, data: data_experiments }: { loading: boolean, data: { calderoncorcesAtacQuery: Experiment_Data[] } } = useQuery(ICRES_ACTIVE_EXPERIMENTS, {
    variables: {
      accession: data_icres?.iCREQuery.map((x) => x.accession) || []
    },
    skip: !data_icres,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  type ICRE_Row = ICRE_Data & { activeExps?: { [key: string]: Experiment_Data[] } }

  const rowsNoExps: ICRE_Row[] = data_icres?.iCREQuery || []

  const rowsWithExps = rowsNoExps.length > 0 && data_experiments && rowsNoExps.map((row: ICRE_Row) => {
    let activeExps: { [key: string]: Experiment_Data[] } = {}

    data_experiments.calderoncorcesAtacQuery.forEach(exp => {
      //Cutoff for experiment activity set at 1.64
      if (exp.start === row.coordinates.start && exp.value > 1.64) {
        if (activeExps[exp.grouping]) {
          activeExps[exp.grouping] = [...activeExps[exp.grouping], exp]
        } else {
          activeExps[exp.grouping] = [exp]
        }
      }
    });

    return { ...row, activeExps: activeExps }
  })

  return (
    (<main>
      <Grid2 container sx={{ maxWidth: "80%", mr: "auto", ml: "auto", mt: "1rem" }}>
        <Grid2 container sx={{ ml: "0.5em", mt: "4rem", mb: "2rem" }}>
          <Grid2
            size={{
              xs: 12,
              lg: 12
            }}>
            {searchParams.get("chromosome") && <Typography variant="h5">{`Showing immune Candidate cis-Regulatory Elements (cCREs) in the region ${searchParams.get('chromosome')}:${searchParams.get('start')}-${searchParams.get('end')}`}</Typography>}
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              lg: 12
            }}>
            <Tabs aria-label="icres_region_tabs" value={value} onChange={handleChange}>
              <StyledTab label="Table View" />
            </Tabs>
          </Grid2>
        </Grid2>
        {value === 0 &&
          loading_icres ?
          <CircularProgress />
          :
          error_icres ?
          <Typography>There was an error fetching data, please try again soon!</Typography>
          :
          <DataTable
            columns={[
              {
                header: "Accession",
                value: (row) => row.accession,

              },
              {
                header: "rDHS",
                value: (row) => row.rdhs,
              },
              {
                header: "Chromosome",
                value: (row) => row.coordinates.chromosome || "",

              },
              {
                header: "Start",
                value: (row) => row.coordinates.start || "",

              },
              {
                header: "End",
                value: (row) => row.coordinates.end || "",

              },
              {
                header: "Active Cell Types",
                HeaderRender: () => {
                  return (
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <Typography variant="body2">
                        Active Cell Types
                      </Typography>
                      <Tooltip arrow title="Activity in cell types determined by aggregated ATAC-seq signal z-score of >1.64 (95th percentile)">
                        <InfoOutlined />
                      </Tooltip>
                    </Stack>
                  )
                },
                value: (row) => row.celltypes.map(x => getCellDisplayName(x)).length,
                FunctionalRender: (row) => {
                  return (
                    <ActiveCellTypesList celltypes={row.celltypes} />
                  )
                }
              },
              {
                header: "Active Experiments",
                HeaderRender: () => {
                  return (
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <Typography variant="body2">
                        Active Experiments
                      </Typography>
                      <Tooltip arrow title="Activity in individual experiments determined by an ATAC-seq signal z-score of >1.64 (95th percentile)">
                        <InfoOutlined />
                      </Tooltip>
                    </Stack>
                  )
                },
                value: (row: ICRE_Row) => row?.activeExps ? Object.values(row.activeExps).flat().length : 0,
                FunctionalRender: (row: ICRE_Row) => {
                  return (
                    row?.activeExps ?
                      <ActiveExperimentList activeExps={row.activeExps} />
                      :
                      <CircularProgress />
                  )
                }
              },
            ]}
            tableTitle={`iCREs`}
            rows={rowsWithExps ?? rowsNoExps}
            onRowClick={(row) => {
              router.push(`/icres?accession=${row.accession}`)
            }}
            sortColumn={3}
            itemsPerPage={10}
            searchable
          />
        }
      </Grid2>
    </main>)
  );
}
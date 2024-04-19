
import { client } from "../../common/utils"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams, useRouter } from "next/navigation"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { StyledTab } from "../../common/utils"
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import { ICRES_ACTIVE_EXPERIMENTS, ICRES_QUERY } from "./queries"
import { experimentInfo } from "../../common/consts"
import { getCellDisplayName } from "../celllineage/utils"
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material"

export const IcresByRegion = (props) => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  const router = useRouter()
  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }

  const { loading: loading_icres, data: data_icres } = useQuery(ICRES_QUERY, {
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

  const { loading: loading_experiments, data: data_experiments } = useQuery(ICRES_ACTIVE_EXPERIMENTS, {
    variables: {
      accession: data_icres?.iCREQuery.map((x) => x.accession) || []
    },
    skip: !data_icres,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  console.log(data_experiments)

  return (
    <main>
      <Grid2 container sx={{ maxWidth: "80%", mr: "auto", ml: "auto", mt: "1rem" }}>
        <Grid2 container sx={{ ml: "0.5em", mt: "4rem", mb: "2rem" }}>
          <Grid2 xs={12} lg={12}>
            {searchParams.get("chromosome") && <Typography variant="h5">{`Showing immune Candidate cis-Regulatory Elements (cCREs) in the region ${searchParams.get('chromosome')}:${searchParams.get('start')}-${searchParams.get('end')}`}</Typography>}
          </Grid2>
          <Grid2 xs={12} lg={12}>
            <Tabs aria-label="icres_region_tabs" value={value} onChange={handleChange}>
              <StyledTab label="Table View" />
            </Tabs>
          </Grid2>
        </Grid2>
        {/* This needs to have proper loading state */}
        {value === 0 && !loading_icres && data_icres && data_experiments && <DataTable
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
              header: "Celltypes",
              value: (row) => row.celltypes.map(x => getCellDisplayName(x)).join(', '),
              sort: (a, b) => a.celltypes.length - b.celltypes.length,
              FunctionalRender: (row) => {
                const [open, setOpen] = useState(false)

                const celltypes = row.celltypes.map(x => getCellDisplayName(x))

                const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  event.stopPropagation()
                  setOpen(!open);
                };

                return (
                  celltypes.length > 0 ?
                    <List>
                      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
                        <ListItemText primary={"Active in " + celltypes.length + " immune cell types"} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List sx={{pl: 2}} component="div" disablePadding>
                          {
                            celltypes.map((cell: string) =>
                              <ListItemText key={cell} primary={"\u2022 " + cell} />
                            )
                          }
                        </List>
                      </Collapse>
                    </List>
                    :
                    <Typography pl={2}>Not Active</Typography>
                )
              }
            },
            {
              header: "Active Experiments",
              value: (row) => null,
              FunctionalRender: (row) => {
                const [open, setOpen] = useState(false)

                type ExperimentInfo = {grouping: string, description: string, name: string, start: number, value: number}

                //Accessing global scope variable here is not great, should maybe pass it in as part of the rows object. That seems cleaner

                /**
                 * @todo 4/19
                 * - Find out which score is the cutoff for "active" in an experiment
                 * - Refactor this to pass experiment info as part of the rows prop (and properly type it). Nothing seems correct here
                 */

                const experiments: ExperimentInfo[]  = data_experiments.calderoncorcesAtacQuery

                let groupings: {[key: string]: ExperimentInfo[]} = {}

                experiments.forEach(exp => {
                  if (exp.start === row.coordinates.start && exp.value > 0) {
                    if (groupings[exp.grouping]) {
                      groupings[exp.grouping] = [...groupings[exp.grouping], exp]
                    } else {
                      groupings[exp.grouping] = [exp]
                    }
                  }
                });

                const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  event.stopPropagation()
                  setOpen(!open);
                };


                type GroupListProps = {exps: ExperimentInfo[], grouping: string}

                const GroupList: React.FC<GroupListProps> = (props: GroupListProps) => {
                  const [openGroup, setOpenGroup] = useState(false)

                  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    event.stopPropagation()
                    setOpenGroup(!openGroup);
                  };

                  return (
                    <List>
                      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
                        <ListItemText primary={`${props.grouping} - (${props.exps.length})`} />
                        {openGroup ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={openGroup} timeout="auto" unmountOnExit>
                        <List sx={{pl: 2}} component="div" disablePadding>
                          {
                            props.exps.map((exp) =>
                            //Todo add hover info
                              <ListItemText key={exp.name} primary={"\u2022 " + exp.name} />
                            )
                          }
                        </List>
                      </Collapse>
                    </List>
                  )
                }

                return (
                  experiments.length > 0 ?
                    <List>
                      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
                        <ListItemText primary={"Active in " + Object.values(groupings).flat().length + " experiments"} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List sx={{pl: 2}} component="div" disablePadding>
                          {
                            Object.entries(groupings).map(([grouping, exps]: [string, ExperimentInfo[]]) =>
                              <GroupList key={grouping} exps={exps} grouping={grouping} />
                            )
                          }
                        </List>
                      </Collapse>
                    </List>
                    :
                    //This case should never happen
                    <Typography pl={2}>Not Active in Any Experiments</Typography>
                )
              }
            },
          ]}
          tableTitle={`iCREs`}
          rows={(data_icres.iCREQuery) || []}
          onRowClick={(row) => {
            router.push(`/icres?accession=${row.accession}`)
          }}
          sortColumn={3}
          itemsPerPage={10}
          searchable
        />}
      </Grid2>
    </main>
  )
}
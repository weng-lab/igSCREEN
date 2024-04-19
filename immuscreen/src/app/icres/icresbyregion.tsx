
import { client } from "../../common/utils"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams, useRouter } from "next/navigation"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { StyledTab } from "../../common/utils"
import { CircularProgress, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import { ICRES_ACTIVE_EXPERIMENTS, ICRES_QUERY } from "./queries"
import { experimentInfo } from "../../common/consts"
import { getCellDisplayName } from "../celllineage/utils"
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material"
import { CellQueryValue } from "../celllineage/types"

export const IcresByRegion = (props) => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  const router = useRouter()
  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }

  type ICRE_Data = { accession: string, rdhs: string, celltypes: CellQueryValue[], coordinates: { chromosome: string, start: number, end: number, } }
  type Experiment_Data = { grouping: string, description: string, name: string, start: number, value: number }

  const { loading: loading_icres, data: data_icres }: { loading: boolean, data: { iCREQuery: ICRE_Data[] } } = useQuery(ICRES_QUERY, {
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

  console.log(rowsWithExps)

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
        {value === 0 && !loading_icres ? <DataTable
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

                /**
                 * @todo should specify whether the cell is stimulated or not
                 */
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
                        <List sx={{ pl: 2 }} component="div" disablePadding>
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
              value: (row: ICRE_Row) => row?.activeExps ? Object.values(row.activeExps).flat().length : 0,
              FunctionalRender: (row: ICRE_Row) => {
                const [open, setOpen] = useState(false)

                const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  event.stopPropagation()
                  setOpen(!open);
                };


                type GroupListProps = { exps: Experiment_Data[], grouping: string }

                const GroupList: React.FC<GroupListProps> = (props: GroupListProps) => {
                  const [openGroup, setOpenGroup] = useState(false)

                  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    event.stopPropagation()
                    setOpenGroup(!openGroup);
                  };

                  return (
                    <List>
                      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
                        <ListItemText primary={`${props.grouping} (${props.exps.length})`} />
                        {openGroup ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={openGroup} timeout="auto" unmountOnExit>
                        <List sx={{ pl: 2 }} component="div" disablePadding>
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
                  row?.activeExps ?
                    <List>
                      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
                        <ListItemText primary={"Active in " + Object.values(row.activeExps).flat().length + " experiments"} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List sx={{ pl: 2 }} component="div" disablePadding>
                          {
                            Object.entries(row.activeExps).map(([grouping, exps]: [string, Experiment_Data[]]) =>
                              <GroupList key={grouping} exps={exps} grouping={grouping} />
                            )
                          }
                        </List>
                      </Collapse>
                    </List>
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
          :
          <CircularProgress />
        }
      </Grid2>
    </main>
  )
}
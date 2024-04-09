
import { client } from "../../common/utils"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams, useRouter } from "next/navigation"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { StyledTab } from "../../common/utils"
import { Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import { ICRES_QUERY } from "./queries"

export const IcresByRegion = (props) => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  const router = useRouter()
  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }
  const { loading: loading, data: data } = useQuery(ICRES_QUERY, {
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
        {value === 0 && !loading && data && <DataTable
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
              value: (row) => row.celltypes.join(","),
            }
          ]}
          tableTitle={`iCREs`}
          rows={(data.iCREQuery) || []}
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
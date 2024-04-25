"use client"
import React, { useState } from "react"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { Tabs, Typography } from "@mui/material"
import { client } from "../../common/utils"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { ReadonlyURLSearchParams, useSearchParams, usePathname } from "next/navigation"

import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { SnpAutoComplete } from "../../common/components/mainsearch/SnpAutocomplete"
import { StyledTab } from "../../common/utils"
import { ICRES_QUERY, EBI_ASSO_QUERY } from "../icres/queries"
import { getCellDisplayName } from "../celllineage/utils"

const EQTL_QUERY = gql`
  query iCREeQTLQuery($study: String!, $rsid: String) {
    icreeQTLQuery(study:$study, rsid:$rsid) {
      variant_id
      pvalue
      qvalue
      geneid          
      celltype
      study
      rsid
      pval_beta
    }
  }
`

const SNP_Query = gql`
  query SNP($snpids: [String]) {
    snpQuery(assembly: "GRCh38", snpids: $snpids) {
      id
      coordinates {
        chromosome
        start
        end
      }
    }
  }
`


//Need better text styling

const Snp = () => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)

  const snp = searchParams.get("rsid")

  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }

  const { loading: ebiloading, data: ebidata } = useQuery(EBI_ASSO_QUERY, {
    variables: {
      snpid: snp
    },
    skip: !snp,
    client,
  })

  const { loading: loading, data: data } = useQuery(EQTL_QUERY, {
    variables: {
      study: "Yazar.Powell",
      rsid: snp
    },
    skip: !snp,
    client,
  })

  const { loading: loadingSNP, data: dataSNP } = useQuery(SNP_Query, {
    variables: {
      snpids: [snp]
    },
    skip: !snp,
    client,
  })

  const { loading: loadingOverlapICRE, data: dataOverlapICRE } = useQuery(ICRES_QUERY, {
    variables: {
      coordinates: { chromosome: dataSNP?.snpQuery[0].coordinates.chromosome, start: dataSNP?.snpQuery[0].coordinates.start - 2000, end: dataSNP?.snpQuery[0].coordinates.start + 2000 }
    },
    skip: loadingSNP || !dataSNP,
    client,
  })

  return !snp ? (<main>

    <Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
      <Grid2 xs={6} sx={{ mt: "5em", ml: "2em" }}>
        <Typography variant="h3">SNP Portal</Typography>
        <br />
        <br />
        <br />
        <SnpAutoComplete textColor={"black"} assembly={"GRCh38"} />
      </Grid2>
    </Grid2>
  </main>) : (
    <main>
      <Grid2 container spacing={4} sx={{ maxWidth: "70%", mr: "auto", ml: "auto", mt: "3rem" }}>
        <Grid2 xs={12} lg={12}>
          {snp && <Typography variant="h4">SNP Details: {snp}{dataSNP && " - " + dataSNP.snpQuery[0].coordinates.chromosome + ":" + dataSNP.snpQuery[0].coordinates.end}</Typography>}
          <Tabs aria-label="snps_tabs" value={value} onChange={handleChange}>
            <StyledTab label="eQTLs" />
            <StyledTab label="GWAS Variants" />
          </Tabs>
        </Grid2>
        <Grid2 xs={12} lg={12}>
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
                value: (row) => row.coordinates.chromosome,
              },
              {
                header: "Start",
                value: (row) => row.coordinates.start,
              },
              {
                header: "End",
                value: (row) => row.coordinates.end,
              },
              {
                header: "Class",
                value: (row) => row.group,
              },
              {
                header: "Cell Type Specific Activity",
                value: (row) => [... new Set(row.celltypes.map(x => getCellDisplayName(x, true)))].join(', '),
              },
            ]}
            tableTitle={`iCREs within 2kbp of ${snp}:`}
            rows={dataOverlapICRE?.iCREQuery || []}
            itemsPerPage={10}
            sortColumn={3}
          />
        </Grid2>
        <Grid2 xs={12} lg={12}>
          <DataTable
            columns={[
              {
                header: "Gene Id",
                value: (row) => row.geneid || "",
              },
              {
                header: "P-Value",
                value: (row) => row.pvalue && row.pvalue.toExponential(2) || 0,
              },
              {
                header: "Q-Value",
                value: (row) => row.qvalue && row.qvalue.toExponential(2) || 0,
              },
              {
                header: "Celltype",
                value: (row) => row.celltype || "",
              }
            ]}
            tableTitle={`Yazar.Powell eQTLs identified for ${searchParams.get('rsid')}:`}
            rows={data?.icreeQTLQuery || []}
            itemsPerPage={10}
          />
        </Grid2>
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
                header: "P-Value",
                value: (row) => row.p_value && row.p_value.toExponential(2) || 0,
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
            tableTitle={`Trait Associations for ${snp}:`}
            rows={ebidata?.ebiAssociationsQuery || []}
            sortColumn={3}
            itemsPerPage={10}
          />
        </Grid2>
      </Grid2>
    </main>
  )
}

export default Snp;
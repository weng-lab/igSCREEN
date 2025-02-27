'use client'

import { useQuery } from "@apollo/client"
import { Typography } from "@mui/material"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { toScientificNotation } from "common/utils"
import { gql } from "types/generated/gql"

export default function SNPeQTLs({
  params
}: {
  params: { rsID: string }
}) {

  const EQTL_QUERY = gql(`
    query SNPeQTLQuery($study: String!, $rsid: String) {
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
  `)

  const { loading: loading, data: data } = useQuery(EQTL_QUERY, {
    variables: {
      study: "Yazar.Powell",
      rsid: params.rsID
    }
  })

  return (
    <DataTable
      columns={[
        {
          header: "Gene Id",
          value: (row: any) => row.geneid || "",
        },
        {
          header: "P",
          HeaderRender: () => <Typography variant="body2"><i>P</i></Typography>,
          value: (row: any) => row.pvalue && toScientificNotation(row.pvalue, 2) || 0,
        },
        {
          header: "Q",
          HeaderRender: () => <Typography variant="body2"><i>Q</i></Typography>,
          value: (row: any) => row.qvalue && toScientificNotation(row.qvalue, 2) || 0,
        },
        {
          header: "Celltype",
          value: (row: any) => row.celltype || "",
        }
      ]}
      tableTitle={`Yazar.Powell eQTLs for ${params.rsID}`}
      rows={data?.icreeQTLQuery || []}
      itemsPerPage={10} />
  )
}
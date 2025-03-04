import { useQuery } from "@apollo/client"
import { CircularProgress, Grid2, Typography } from "@mui/material"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { toScientificNotation } from "common/utils"
import { gql } from "types/generated"

const COMBINED_EQTL_QUERY = gql(`
  query CombinedEqtl($geneid: String) {
    GTEX: icreeQTLQuery(study: "GTEX", geneid: $geneid) {
      variant_id
      qvalue
      geneid
      pval_nominal
      phenotype_id
      celltype
      study
      rsid
      pval_beta
    }
      SoskicTrynka: icreeQTLQuery(study: "Soskic.Trynka", geneid: $geneid) {
      variant_id
      pvalue
      qvalue
      geneid
      pval_nominal
      phenotype_id
      celltype
      study
      rsid
      pval_beta
    }
      YazarPowell: icreeQTLQuery(study: "Yazar.Powell", geneid: $geneid) {
      variant_id
      pvalue
      qvalue
      geneid
      pval_nominal
      phenotype_id
      celltype
      study
      rsid
      pval_beta
    }
  } 
`)

type GeneEQTLsProps = {
  name: string
  id: string
}

const GeneEQTLs = ({ name, id }: GeneEQTLsProps) => {

  /**
   * @todo confirm that this actually works by finding a gene with eQTL data
   */
  
  const { loading, data, error } = useQuery(COMBINED_EQTL_QUERY, {
    variables: {
      geneid: id
    },
  })

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    throw new Error(JSON.stringify(error))
  }

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={12}>
        <DataTable
          columns={[
            {
              header: "Variant Id",
              value: (row) => row.variant_id || "",
            },
            {
              header: "Nominal P",
              HeaderRender: () => <Typography variant="body2">Nominal <i>P</i></Typography>,
              value: (row) => row.pval_nominal && toScientificNotation(row.pval_nominal, 2) || 0,
            },
            {
              header: "Beta P",
              HeaderRender: () => <Typography variant="body2">Beta <i>P</i></Typography>,
              value: (row) => row.pval_beta && toScientificNotation(row.pval_beta, 2) || 0,
            }
          ]}
          tableTitle={`GTEX whole-blood eQTLs for ${name}`}
          rows={data.GTEX}
          itemsPerPage={10}
        />
      </Grid2>
      <Grid2 size={12}>
        <DataTable
          columns={[
            {
              header: "SNP",
              value: (row) => row.rsid || "",
            },
            {
              header: "P",
              HeaderRender: () => <Typography variant="body2"><i>P</i></Typography>,
              value: (row) => row.pvalue && toScientificNotation(row.pvalue, 2) || 0,
            },
            {
              header: "Q",
              HeaderRender: () => <Typography variant="body2"><i>Q</i></Typography>,
              value: (row) => row.qvalue && toScientificNotation(row.qvalue, 2) || 0,
            },
            {
              header: "Celltype",
              value: (row) => row.celltype || "",
            }
          ]}
          tableTitle={`Yazar.Powell eQTLs for ${name}`}
          rows={data.YazarPowell}
          sortColumn={3}
          itemsPerPage={10}
        />
      </Grid2>
      <Grid2 size={12}>
        <DataTable
          columns={[
            {
              header: "Variant Id",
              value: (row: any) => row.variant_id || "",
            },
            {
              header: "Nominal P",
              HeaderRender: () => <Typography variant="body2">Nominal <i>P</i></Typography>,
              value: (row: any) => row.pval_nominal && toScientificNotation(row.pval_nominal, 2) || 0,
            },
            {
              header: "Beta P",
              HeaderRender: () => <Typography variant="body2">Beta <i>P</i></Typography>,
              value: (row: any) => row.pval_beta && toScientificNotation(row.pval_beta, 2) || 0,
            },
            {
              header: "Celltype",
              value: (row: any) => row.celltype || "",
            }
          ]}
          tableTitle={`Soskic.Trynka eQTLs for ${name}`}
          rows={data.SoskicTrynka}
          sortColumn={3}
          itemsPerPage={10}
        />
      </Grid2>
    </Grid2>
  )
}

export default GeneEQTLs
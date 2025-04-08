import { useQuery } from "@apollo/client"
import { Skeleton } from "@mui/material"
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro"
import { toScientificNotation } from "common/utils"
import { gql } from "types/generated/gql"
import DataGridToolbar from "common/components/dataGridToolbar"

type SnpEQTLsProps = {
  rsid: string
}

const SnpEQTLs = ({rsid}: SnpEQTLsProps) => {
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
      rsid
    }
  })

  if (loading) {
    return <Skeleton variant="rounded" width={"100%"} height={705} />
  }

  return (
    <DataGridPro
      rows={data?.icreeQTLQuery || []}
      columns={columns}
      initialState={{
        sorting: {
          sortModel: [{ field: "pvalue", sort: "asc" }],
        },
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      slots={{ toolbar: DataGridToolbar }}
      slotProps={{ toolbar: { title: `Yazar.Powell eQTLs for ${rsid}` } }}
      density="compact"
      style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
      getRowId={(row) => row.variant_id + row.pvalue}
    />
  )
}

const columns: GridColDef[] = [
  {
    field: "geneid",
    headerName: "Gene Id",
    flex: 2,
  },
  {
    field: "pvalue",
    headerName: "P",
    flex: 1,
    renderCell: (params) => (
      toScientificNotation(params.value, 2)
    ),
  },
  {
    field: "qvalue",
    headerName: "Q",
    flex: 1,
    renderCell: (params) => (
      toScientificNotation(params.value, 2)
    ),  
  },
  {
    field: "celltype",
    headerName: "Celltype",
    flex: 1,
  }
]

export default SnpEQTLs

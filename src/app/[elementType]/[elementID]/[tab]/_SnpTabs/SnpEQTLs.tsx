import { useQuery } from "@apollo/client"
import { Skeleton } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { GridColDef } from "@mui/x-data-grid-pro"
import { toScientificNotation } from "common/utils"
import { gql } from "types/generated/gql"
import DataGridToolbar from "../_SharedTabs/dataGridToolbar"

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
    <DataGrid
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

{/* <DataTable
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
tableTitle={`Yazar.Powell eQTLs for ${rsid}`}
rows={data?.icreeQTLQuery || []}
itemsPerPage={10} /> */}
import { useQuery } from "@apollo/client";
import { Grid2, Link, Skeleton } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { toScientificNotation } from "common/utility";
import { gql } from "types/generated";
import DataGridToolbar from "common/components/dataGridToolbar";

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
      SoskicTrynka: icreeQTLQuery(study: "Soskic.Trynka", phenotype_id: $geneid) {
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
`);

type GeneEQTLsProps = {
  name: string;
  id: string;
};

const GeneEQTLs = ({ name, id }: GeneEQTLsProps) => {
  const { loading, data, error } = useQuery(COMBINED_EQTL_QUERY, {
    variables: {
      geneid: id.split(".")[0],
    },
  });

  if (loading) {
    return (
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={215} />
        </Grid2>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={215} />
        </Grid2>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={215} />
        </Grid2>
      </Grid2>
    );
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <DataGridPro
          columns={columns}
          rows={data.GTEX}
          getRowId={(row) => row.variant_id + row.pvalue}
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{ toolbar: { title: `GTEX whole-blood eQTLs for ${name}` } }}
          pagination
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          density="compact"
          style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
        />
      </Grid2>
      <Grid2 size={12}>
        <DataGridPro
          columns={YazarPowellColumns}
          rows={data.YazarPowell}
          getRowId={(row) => row.variant_id + row.pvalue}
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{ toolbar: { title: `Yazar.Powell eQTLs for ${name}` } }}
          pagination
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          density="compact"
          style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
        />
      </Grid2>
      <Grid2 size={12}>
        <DataGridPro
          columns={SoskicTrynkaColumns}
          rows={data.SoskicTrynka}
          getRowId={(row) => row.variant_id + row.pvalue}
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{ toolbar: { title: `Soskic.Trynka eQTLs for ${name}` } }}
          pagination
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          density="compact"
          style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
        />
      </Grid2>
    </Grid2>
  );
};

export default GeneEQTLs;

const columns: GridColDef[] = [
  {
    field: "variant_id",
    headerName: "Variant Id",
    flex: 2,
  },
  {
    field: "pval_nominal",
    headerName: "Nominal P",
    flex: 1,
    renderCell: (params) => toScientificNotation(params.value, 2),
  },
  {
    field: "pval_beta",
    headerName: "Beta P",
    flex: 1,
    renderCell: (params) => toScientificNotation(params.value, 2),
  },
];

const YazarPowellColumns: GridColDef[] = [
  {
    field: "rsid",
    headerName: "SNP",
    flex: 2,
    renderCell: (params) => {
      return <Link href={`/snp/${params.value}`}>{params.value}</Link>;
    },
  },
  {
    field: "pvalue",
    headerName: "P",
    flex: 1,
    renderCell: (params) => toScientificNotation(params.value, 2),
  },
  {
    field: "qvalue",
    headerName: "Q",
    flex: 1,
    renderCell: (params) => toScientificNotation(params.value, 2),
  },
  {
    field: "celltype",
    headerName: "Celltype",
    flex: 2,
  },
];

const SoskicTrynkaColumns: GridColDef[] = [
  {
    field: "variant_id",
    headerName: "Variant Id",
    flex: 2,
  },
  {
    field: "pval_nominal",
    headerName: "Nominal P",
    flex: 1,
    renderCell: (params) => toScientificNotation(params.value, 2),
  },
  {
    field: "pval_beta",
    headerName: "Beta P",
    flex: 1,
    renderCell: (params) => toScientificNotation(params.value, 2),
  },
  {
    field: "celltype",
    headerName: "Celltype",
    flex: 2,
  },
];

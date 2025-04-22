import { useQuery } from "@apollo/client";
import { Skeleton, Link, Stack, Box } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { toScientificNotationElement } from "common/utility";
import { gql } from "types/generated/gql";
import DataGridToolbar from "common/components/dataGridToolbar";

type SnpEQTLsProps = {
  rsid: string;
};

const SnpEQTLs = ({ rsid }: SnpEQTLsProps) => {
  const SNP_EQTL_QUERY = gql(`
 query getimmuneeQTLsQuery($genes: [String], $snps: [String],$ccre: [String]) {
  immuneeQTLsQuery(genes: $genes, snps: $snps, ccre: $ccre) {
    rsid
    genename
    study
    fdr
    celltype
    ref
    chromosome
    position
    alt
    variant_id    
    pval_nominal
    ccre
    slope
    spearmans_rho
  }
} 
    `);

  const { loading: loading, data: data } = useQuery(SNP_EQTL_QUERY, {
    variables: {
      snps: [rsid],
    },
    skip: !rsid,
  });

  if (loading) {
    return <Skeleton variant="rounded" width={"100%"} height={705} />;
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ flex: "1 1 auto" }}>
      <DataGridPro
        rows={data.immuneeQTLsQuery.filter((i) => i.study === "GTEX") || []}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: "pval_nominal", sort: "asc" }],
          },
          pagination: {
            paginationModel: {
              pageSize: 5,
              page: 0,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
       
        slots={{ toolbar: DataGridToolbar }}
        slotProps={{ toolbar: { title: `GTEX whole-blood eQTLs for ${rsid}` } }}
        density="compact"
        sx={{
          borderRadius: 1,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        }}
        getRowId={(row) => row.variant_id + row.genename + row.pval_nominal}
      />
      </Box>
      <Box sx={{ flex: "1 1 auto" }}>
      <DataGridPro
        columns={OneK1KColumns}
        rows={data.immuneeQTLsQuery.filter((i) => i.study === "OneK1K") || []}
        getRowId={(row) => row.variant_id + row.fdr}
        slots={{ toolbar: DataGridToolbar }}
        slotProps={{ toolbar: { title: `OneK1K eQTLs for ${rsid}` } }}
        pagination
        initialState={{
          sorting: {
            sortModel: [{ field: "fdr", sort: "asc" }],
          },
          pagination: {
            paginationModel: {
              pageSize: 5,
              page: 0,
            },
          },
        }}
        density="compact"
        sx={{
          borderRadius: 1,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        }}
      />
      </Box>
    </Stack>
  );
};

const columns: GridColDef[] = [
  {
    field: "variant_id",
    headerName: "Variant Name",
    flex: 2,
  },

  {
    field: "genename",
    headerName: "Gene",
    flex: 2,
    renderCell: (params) => {
      return params.value === "." ? <>{params.value}</> : <Link href={`/gene/${params.value}`}>{params.value}</Link>;
    },
  },
  {
    field: "slope",
    headerName: "Slope",
    flex: 1,
    display: "flex",
    renderCell: (params) => toScientificNotationElement(params.value, 2, {variant: "body2"}),
  },
  {
    field: "pval_nominal",
    headerName: "Nominal P",
    flex: 1.5,
    display: "flex",
    renderCell: (params) => toScientificNotationElement(params.value, 2, {variant: "body2"}),
  },
  {
    field: "ccre",
    headerName: "iCRE",
    flex: 2,
    renderCell: (params) => {
      return params.value === "." ? <>{params.value}</> : <Link href={`/icre/${params.value}`}>{params.value}</Link>;
    },
  },
];

const OneK1KColumns: GridColDef[] = [
  {
    field: "genename",
    headerName: "Gene",
    flex: 2,
    renderCell: (params) => {
      return <Link href={`/gene/${params.value}`}>{params.value}</Link>;
    },
  }, 
  {
    field: "fdr",
    headerName: "FDR",
    flex: 1.5,
    display: "flex",
    renderCell: (params) => toScientificNotationElement(params.value, 2, {variant: "body2"}),
  },
  {
    field: "spearmans_rho",
    headerName: "Spearman's rho",
    flex: 1,
    display: "flex",
    renderCell: (params) => toScientificNotationElement(params.value, 2, {variant: "body2"}),
  },
  
  {
    field: "celltype",
    headerName: "Celltype",
    flex: 2,
  }, 
  {
    field: "ccre",
    headerName: "iCRE",
    flex: 2,
    renderCell: (params) => {
      return params.value === "." ? <>{params.value}</> : <Link href={`/icre/${params.value}`}>{params.value}</Link>;
    },
  },
];

export default SnpEQTLs;

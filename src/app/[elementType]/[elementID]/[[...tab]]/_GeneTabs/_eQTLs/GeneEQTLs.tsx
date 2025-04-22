import { useQuery } from "@apollo/client";
import { Grid2, Link, Skeleton, Stack, Box } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import {  toScientificNotationElement } from "common/utility";
import { gql } from "types/generated";
import DataGridToolbar from "common/components/dataGridToolbar";

const GENE_EQTL_QUERY = gql(`
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

type GeneEQTLsProps = {
  name: string;
  id: string;
};

const GeneEQTLs = ({ name, id }: GeneEQTLsProps) => {
  const { loading, data, error } = useQuery(GENE_EQTL_QUERY, {
    variables: {
      genes: [name],
    },
    skip: !name,
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
    <Stack spacing={2}>
      <Box sx={{ flex: "1 1 auto" }}>
        <DataGridPro
          columns={columns}
          rows={data.immuneeQTLsQuery.filter((i) => i.study === "GTEX") || []}
          getRowId={(row) => row.variant_id + row.rsid + row.pval_nominal}
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{ toolbar: { title: `GTEX whole-blood eQTLs for ${name}` } }}
          pagination
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
          density="compact"
          sx={{
            borderRadius: 1,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </Box>
      <Box sx={{ flex: "1 1 auto" }}>
        <DataGridPro
          columns={OneK1KColumns}
          rows={data.immuneeQTLsQuery.filter((i) => i.study === "OneK1K") || []}
          getRowId={(row) => row.variant_id + row.fdr}
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{ toolbar: { title: `OneK1K eQTLs for ${name}` } }}
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
          pageSizeOptions={[5, 10]}
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

export default GeneEQTLs;

const columns: GridColDef[] = [
  {
    field: "variant_id",
    headerName: "Variant Name",
    flex: 2,
  },

  {
    field: "rsid",
    headerName: "rs ID",
    flex: 2,
    renderCell: (params) => {
      return params.value === "." ? <>{params.value}</> : <Link href={`/variant/${params.value}`}>{params.value}</Link>;
    },
  },
  {
    field: "chromosome",
    headerName: "Chromosome",
    flex: 2,
  },
  {
    field: "position",
    headerName: "Position",
    flex: 2,
  },
  {
    field: "ref",
    headerName: "Ref",
    flex: 2,
  },
  {
    field: "alt",
    headerName: "Alt",
    flex: 2,
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
    field: "rsid",
    headerName: "rs ID",
    flex: 2,
    renderCell: (params) => {
      return <Link href={`/variant/${params.value}`}>{params.value}</Link>;
    },
  },
  {
    field: "chromosome",
    headerName: "Chromosome",
    flex: 2,
  },
  {
    field: "position",
    headerName: "Position",
    flex: 2,
  },
  {
    field: "ref",
    headerName: "A1",
    flex: 2,
  },
  {
    field: "alt",
    headerName: "A2",
    flex: 2,
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

import { useQuery } from "@apollo/client";
import { Grid2, Link, Skeleton, Stack } from "@mui/material";
import { LinkComponent, toScientificNotationElement } from "common/utility";
import { gql } from "types/generated";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { GetimmuneeQtLsQuery } from "types/generated/graphql";

const GENE_EQTL_QUERY = gql(`
query getimmuneeQTLs($genes: [String], $snps: [String],$ccre: [String]) {
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
      <CustomDataGrid
        columns={columns}
        rows={data.immuneeQTLsQuery.filter((i) => i.study === "GTEX")}
        tableTitle={`GTEX whole-blood eQTLs for ${name}`}
        initialState={{
          sorting: {
            sortModel: [{ field: "pval_nominal", sort: "asc" }],
          },
        }}
      />
      <CustomDataGrid
        columns={OneK1KColumns}
        rows={data.immuneeQTLsQuery.filter((i) => i.study === "OneK1K")}
        tableTitle={`OneK1K eQTLs for ${name}`}
        initialState={{
          sorting: {
            sortModel: [{ field: "fdr", sort: "asc" }],
          },
        }}
      />
    </Stack>
  );
};

export default GeneEQTLs;

const columns: CustomDataGridColDef<GetimmuneeQtLsQuery["immuneeQTLsQuery"][number]>[] = [
  {
    field: "variant_id",
    headerName: "Variant Name",
  },
  {
    field: "rsid",
    headerName: "rsID",
    renderCell: (params) => {
      return params.value === "." ? <>{params.value}</> : <Link href={`/variant/${params.value}`}>{params.value}</Link>;
    },
  },
  {
    field: "chromosome",
    headerName: "Chromosome",
  },
  {
    field: "position",
    headerName: "Position",
  },
  {
    field: "ref",
    headerName: "Ref",
  },
  {
    field: "alt",
    headerName: "Alt",
  },
  {
    field: "slope",
    headerName: "Slope",
    renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
  },
  {
    field: "pval_nominal",
    headerName: "Nominal P",
    renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
  },
  {
    field: "ccre",
    headerName: "iCRE",
    renderCell: (params) => params.value === "." ? params.value : <LinkComponent href={`/icre/${params.value}`}>{params.value}</LinkComponent>
  },
];

const OneK1KColumns: CustomDataGridColDef<GetimmuneeQtLsQuery["immuneeQTLsQuery"][number]>[] = [
  {
    field: "rsid",
    headerName: "rsID",
    renderCell: (params) => <Link href={`/variant/${params.value}`}>{params.value}</Link>,
  },
  {
    field: "chromosome",
    headerName: "Chromosome",
  },
  {
    field: "position",
    headerName: "Position",
  },
  {
    field: "ref",
    headerName: "A1",
  },
  {
    field: "alt",
    headerName: "A2",
  },
  {
    field: "fdr",
    headerName: "FDR",
    renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
  },
  {
    field: "spearmans_rho",
    headerName: "Spearman's rho",
    renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
  },
  {
    field: "celltype",
    headerName: "Celltype",
  },
  {
    field: "ccre",
    headerName: "iCRE",
    renderCell: (params) => params.value === "." ? params.value : <LinkComponent href={`/icre/${params.value}`}>{params.value}</LinkComponent>,
  },
];

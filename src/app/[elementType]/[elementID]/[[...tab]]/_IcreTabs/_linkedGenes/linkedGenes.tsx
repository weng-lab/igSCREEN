import { Grid2 as Grid, Skeleton, Stack, Typography } from "@mui/material";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "./columns";
import LinkedElements from "common/components/linkedElements/linkedElements";
import { TableDef } from "common/components/linkedElements/columns";
import { useQuery } from "@apollo/client";
import { CLOSEST_GENE_QUERY } from "./query";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import DataGridToolbar from "common/components/dataGridToolbar";
import { LinkComponent } from "common/utility";

export default function LinkedGenes({ accession }: { accession: string }) {
  const { data: linkedGenes, loading, error } = useLinkedGenes(accession);
  const {
    data: closestGeneData,
    loading: closestGeneLoading,
    error: closestGeneError,
  } = useQuery(CLOSEST_GENE_QUERY, {
    variables: {
      ccre: [accession],
    },
  });

  console.log(closestGeneData?.closestGenetocCRE);

  if (loading || closestGeneLoading) {
    const NUM_TABLES = 5;
    return (
      <Grid container spacing={2}>
        {[...Array(NUM_TABLES)].map((_, i) => (
          <Grid size={12} key={i}>
            <Skeleton variant="rounded" width="100%" height={100} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error || closestGeneError) {
    return <Typography>Error: {error?.message || closestGeneError?.message}</Typography>;
  }

  // make types for the data
  const HiCLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.assay === "Intact-HiC")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const ChIAPETLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const crisprLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.method === "CRISPR")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const eqtlLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.method === "eQTLs")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));

  const tables: TableDef[] = [
    { name: "Intact Hi-C Loops", data: HiCLinked, columns: IntactHiCLoopsCols },
    {
      name: "ChIAPET",
      data: ChIAPETLinked,
      columns: ChIAPETCols,
    },
    {
      name: "CRISPRi-FlowFISH",
      data: crisprLinked,
      columns: CrisprFlowFISHCols,
    },
    { name: "eQTLs", data: eqtlLinked, columns: eQTLCols },
  ];

  const closestGenes = closestGeneData.closestGenetocCRE.map((item: any) => item.gene);

  return (
    <Stack spacing={2}>
      {closestGenes.length > 0 ? (
        <DataGridPro
          rows={closestGenes}
          getRowId={(row: any) => row.name}
          columns={closestGenesCols}
          hideFooter
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{ toolbar: { title: "Closest Genes" } }}
        />
      ) : (
        <Typography
          variant="h6"
          pl={1}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            p: 2,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            marginBottom: 2,
          }}
        >
          No closest genes found
        </Typography>
      )}
      <LinkedElements tables={tables} />
    </Stack>
  );
}

const closestGenesCols: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    renderCell: (params: any) =>
      params.value.startsWith("ENSG") ? (
        <i>{params.value}</i>
      ) : (
        <LinkComponent href={`/gene/${params.value}`} underline="hover">
          <i>{params.value}</i>
        </LinkComponent>
      ),
  },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "chromosome", headerName: "Chromosome", flex: 1 },
  { field: "start", headerName: "Start", flex: 1 },
  { field: "stop", headerName: "Stop", flex: 1 },
];

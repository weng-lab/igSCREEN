import { Grid2 as Grid, Skeleton, Stack, Typography } from "@mui/material";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "./columns";
import LinkedElements, { TableDef } from "common/components/linkedElements/linkedElements";
import { useQuery } from "@apollo/client";
import { CLOSEST_GENE_QUERY } from "./query";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import DataGridToolbar from "common/components/dataGridToolbar";
import { LinkComponent, calcDistRegionToRegion } from "common/utility";
import { GenomicRange } from "types/globalTypes";
import CustomDataGrid from "common/components/CustomDataGrid";

export default function LinkedGenes({ accession, coordinates }: { accession: string, coordinates: GenomicRange }) {
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

  const tables: TableDef<LinkedGeneInfo>[] = [
    { tableTitle: "Intact Hi-C Loops", rows: HiCLinked, columns: IntactHiCLoopsCols, sortColumn: "p_val", sortDirection: 'asc' },
    {
      tableTitle: "ChIA-PET",
      rows: ChIAPETLinked,
      columns: ChIAPETCols,
      sortColumn: "score",
      sortDirection: "desc",
    },
    {
      tableTitle: "CRISPRi-FlowFISH",
      rows: crisprLinked,
      columns: CrisprFlowFISHCols,
      sortColumn: "p_val",
      sortDirection: "asc",
    },
    { tableTitle: "eQTLs", rows: eqtlLinked, columns: eQTLCols, sortColumn: "p_val", sortDirection: "asc"},
  ];

  const genes: any[] = closestGeneData.closestGenetocCRE.map((item: any) => item.gene);
  const closestPC = genes.find((gene: any) => gene.type === "PC");
  const closestALL = genes.find((gene: any) => gene.type === "ALL");
  const pcDistance = calcDistRegionToRegion({start: closestPC.start, end: closestPC.stop}, {start: coordinates.start, end: coordinates.end});
  const allDistance = calcDistRegionToRegion({start: closestALL.start, end: closestALL.stop}, {start: coordinates.start, end: coordinates.end});
  const closestGenes = [{...closestPC, distance: Math.abs(pcDistance)}, {...closestALL, distance: Math.abs(allDistance)}];
  return (
    <Stack spacing={2}>
      {closestGenes.length > 0 ? (
        <CustomDataGrid rows={closestGenes} columns={closestGenesCols} hideFooter tableTitle="Closest Genes" />
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
  { field: "type", headerName: "Type" },
  { field: "chromosome", headerName: "Chromosome" },
  { field: "start", headerName: "Start", type: "number" },
  { field: "stop", headerName: "End", type: "number" },
  { field: "distance", headerName: "Distance", type: "number" },
];

import { CircularProgress, Grid2 as Grid, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IntactHiCLoopsCols } from "./columns";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";

export default function LinkedGenes({ accession }: { accession: string }) {
  const { data, loading, error } = useLinkedGenes(accession);

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error: {error.message}</Typography>;

  // make types for the data
  const HiCLinked = data.filter(
    (x: LinkedGeneInfo) => x.assay === "Intact-HiC"
  );
  const ChIAPETLinked = data.filter(
    (x: LinkedGeneInfo) =>
      x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET"
  );
  const crisprLinked = data.filter(
    (x: LinkedGeneInfo) => x.method === "CRISPR"
  );
  const eqtlLinked = data.filter((x: LinkedGeneInfo) => x.method === "eQTLs");

  return (
    <Grid container spacing={2} flexDirection="column" sx={{ width: "100%" }}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Typography variant="h6">Intact Hi-C Loops</Typography>
        <DataGrid
          density="comfortable"
          columns={IntactHiCLoopsCols}
          rows={HiCLinked}
          getRowId={(row: LinkedGeneInfo) => row.gene}
          sx={{ width: "100%" }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
        />
      </Grid>
    </Grid>
  );
}

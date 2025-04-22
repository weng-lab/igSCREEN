import { Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "./columns";
import LinkedElements from "common/components/linkedElements/linkedElements";
import { TableDef } from "common/components/linkedElements/columns";

export default function LinkedGenes({ accession }: { accession: string }) {
  const { data, loading, error } = useLinkedGenes(accession);

  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid>
      </Grid>
    );
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  // make types for the data
  const HiCLinked = data
    .filter((x: LinkedGeneInfo) => x.assay === "Intact-HiC")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const ChIAPETLinked = data
    .filter((x: LinkedGeneInfo) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const crisprLinked = data
    .filter((x: LinkedGeneInfo) => x.method === "CRISPR")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const eqtlLinked = data
    .filter((x: LinkedGeneInfo) => x.method === "eQTLs")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));

  const tables: TableDef[] = [
    { name: "Intact Hi-C Loops", data: HiCLinked, columns: IntactHiCLoopsCols },
    {
      name: "ChIA-PET",
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

  return <LinkedElements tables={tables} />;
}

import { Box, Grid2, Skeleton } from "@mui/material";
import useLinkedICREs, { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "../../_IcreTabs/_linkedGenes/columns";
import LinkedElements, { TableDef } from "common/components/linkedElements/linkedElements";
import { accessionCol } from "common/components/linkedElements/columns";


export default function LinkedICREs({ geneid, allcCREs }: { geneid: string, allcCREs: boolean }) {
  const { data, loading, error } = useLinkedICREs(geneid);
  
  if (loading) {
    return (
      <Grid2 container spacing={2} width={"100%"}>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid2>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid2>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid2>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={100} />
        </Grid2>
      </Grid2>
    );
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  const HiCLinked = data
    .filter((x: LinkedICREInfo) => x.assay === "Intact-HiC" && (allcCREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const ChIAPETLinked = data
    .filter((x: LinkedICREInfo) => (x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET") && (allcCREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const crisprLinked = data
    .filter((x: LinkedICREInfo) => x.method === "CRISPR" && (allcCREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const eqtlLinked = data
    .filter((x: LinkedICREInfo) => x.method === "eQTLs" && (allcCREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));

  const tables: TableDef<LinkedICREInfo>[] = [
    {
      tableTitle: "Intact Hi-C Loops",
      rows: HiCLinked,
      columns: [accessionCol, ...IntactHiCLoopsCols.slice(2)],
      sortColumn: "p_val",
      sortDirection: "asc",
    },
    {
      tableTitle: "ChIA-PET",
      rows: ChIAPETLinked,
      columns: [accessionCol, ...ChIAPETCols.slice(2)],
      sortColumn: "score",
      sortDirection: "desc",
    },
    {
      tableTitle: "CRISPRi-FlowFISH",
      rows: crisprLinked,
      columns: [accessionCol, ...CrisprFlowFISHCols.slice(2)],
      sortColumn: "p_val",
      sortDirection: "asc",
    },
    {
      tableTitle: "eQTLs",
      rows: eqtlLinked,
      columns: [accessionCol, ...eQTLCols.slice(2)],
      sortColumn: "p_val",
      sortDirection: "asc",
    },
  ];

  return (
    <Box width={"100%"}>
      <LinkedElements tables={tables} />
    </Box>
  );
}

import { Box, Grid2, Skeleton } from "@mui/material";
import useLinkedICREs, { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "../../_IcreTabs/_Genes/columns";
import LinkedElements, { TableDef } from "common/components/linkedElements/linkedElements";
import { accessionCol } from "common/components/linkedElements/columns";
import { UseGeneDataReturn } from "common/hooks/useGeneData";


export default function ComputationalLinkedCcres({
  geneData,
  allcCREs,
}: {
  geneData: UseGeneDataReturn<{ name: string }>;
  allcCREs: boolean;
}) {
  const { data, loading, error } = useLinkedICREs(geneData?.data.id);

  if (geneData.loading || loading) {
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
    .filter(
      (x: LinkedICREInfo) => (x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET") && (allcCREs || x.isiCRE)
    )
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
      emptyTableFallback: `No intact Hi-C loops overlap ${allcCREs ? "a cCRE": "an iCRE"} and the promoter of this gene`
    },
    {
      tableTitle: "ChIA-PET",
      rows: ChIAPETLinked,
      columns: [accessionCol, ...ChIAPETCols.slice(2)],
      sortColumn: "score",
      sortDirection: "desc",
      emptyTableFallback: `No ChIA-PET interactions overlap ${allcCREs ? "a cCRE": "an iCRE"} and the promoter of this gene`,
    },
    {
      tableTitle: "CRISPRi-FlowFISH",
      rows: crisprLinked,
      columns: [accessionCol, ...CrisprFlowFISHCols.slice(2)],
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: `No ${allcCREs ? "cCREs" : "iCREs"} targeted in a CRISPRi-FlowFISH experiment were linked to this gene`,
    },
    {
      tableTitle: "eQTLs",
      rows: eqtlLinked,
      columns: [accessionCol, ...eQTLCols.slice(2)],
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: `No ${allcCREs ? "cCREs" : "iCREs"} overlap variants associated with significant changes in expression of this gene`,
    },
  ];

  return (
    <Box width={"100%"}>
      <LinkedElements tables={tables} />
    </Box>
  );
}

import { Checkbox, FormControlLabel, Grid2, Skeleton, Stack } from "@mui/material";
import useLinkedICREs, { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "../../_IcreTabs/_linkedGenes/columns";
import LinkedElements from "common/components/linkedElements/linkedElements";
import { TableDef } from "common/components/linkedElements/columns";
import { accessionCol } from "common/components/linkedElements/columns";
import { useState } from "react";


export default function LinkedICREs({ geneid }: { geneid: string }) {
  const { data, loading, error } = useLinkedICREs(geneid);
  const [onlyICREs, setOnlyICREs] = useState<boolean>(true)

  const toggleOnlyICREs = () => {
    setOnlyICREs(!onlyICREs)
  }
  
  if (loading) {
    return (
      <Grid2 container spacing={2}>
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
    .filter((x: LinkedICREInfo) => x.assay === "Intact-HiC" && (!onlyICREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const ChIAPETLinked = data
    .filter((x: LinkedICREInfo) => (x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET") && (!onlyICREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const crisprLinked = data
    .filter((x: LinkedICREInfo) => x.method === "CRISPR" && (!onlyICREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const eqtlLinked = data
    .filter((x: LinkedICREInfo) => x.method === "eQTLs" && (!onlyICREs || x.isiCRE))
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));

  const tables: TableDef[] = [
    { name: "Intact Hi-C Loops", data: HiCLinked, columns: [accessionCol, ...IntactHiCLoopsCols.slice(2)] },
    {
      name: "ChIAPET",
      data: ChIAPETLinked,
      columns: [accessionCol, ...ChIAPETCols.slice(2)],
    },
    {
      name: "CRISPRi-FlowFISH",
      data: crisprLinked,
      columns: [accessionCol, ...CrisprFlowFISHCols.slice(2)],
    },
    { name: "eQTLs", data: eqtlLinked, columns: [accessionCol, ...eQTLCols.slice(2)] },
  ];

  return (
    <Stack spacing={2}>
      <FormControlLabel
        label="Show only iCREs"
        control={<Checkbox />}
        sx={{width: "200px"}}
        checked={onlyICREs}
        onChange={toggleOnlyICREs}
      />
      <LinkedElements tables={tables} />
    </Stack>
  );
}

import { Checkbox, FormControlLabel, Grid2, Skeleton, Stack } from "@mui/material";
import useLinkedICREs, { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "../../_IcreTabs/_linkedGenes/columns";
import LinkedElements from "common/components/linkedElements/linkedElements";
import { TableDef } from "common/components/linkedElements/columns";
import { accessionCol } from "common/components/linkedElements/columns";
import { useState } from "react";
import useNearbycCREs from "common/hooks/useNearBycCREs";


export default function LinkedICREs({ geneid }: { geneid: string }) {
  const { data, loading, error } = useLinkedICREs(geneid);
  
  const [allcCREs, setAllcCREs] = useState<boolean>(false)

  const toggleOnlyICREs = () => {
    setAllcCREs(!allcCREs)
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

  const tables: TableDef[] = [
    { name: "Intact Hi-C Loops", data: HiCLinked, columns: [accessionCol, ...IntactHiCLoopsCols.slice(2)] },
    {
      name: "ChIA-PET",
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
        label="Show all cCREs"
        control={<Checkbox />}
        sx={{width: "200px"}}
        checked={allcCREs}
        onChange={toggleOnlyICREs}
      />
      <LinkedElements tables={tables} />
    </Stack>
  );
}

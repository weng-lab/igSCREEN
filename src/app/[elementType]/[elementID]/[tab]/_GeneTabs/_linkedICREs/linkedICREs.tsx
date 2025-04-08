import { Box, Grid2, Skeleton, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useLinkedICREs, { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import DataGridToolbar from "../../_SharedTabs/dataGridToolbar";
import { CrisprFlowFISHCols, CTCFChIAPETCols, HiCCols, RNAPIIChIAPETCols } from "./columns";
import { accessionCol, ChIAPETCols, eQTLCols, IntactHiCLoopsCols } from "../../_IcreTabs/_linkedGenes/columns";

export default function LinkedICREs({ geneid }: { geneid: string }) {
  const { data, loading, error } = useLinkedICREs(geneid);

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
    .filter((x: LinkedICREInfo) => x.assay === "Intact-HiC")
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const ChIAPETLinked = data
    .filter((x: LinkedICREInfo) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET")
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const crisprLinked = data
    .filter((x: LinkedICREInfo) => x.method === "CRISPR")
    .map((x: LinkedICREInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const eqtlLinked = data
    .filter((x: LinkedICREInfo) => x.method === "eQTLs")
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
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        {tables.map((table, index) =>
          table.data.length > 0 ? (
            <Box
              sx={{
                borderRadius: 1,
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                marginBottom: 2,
              }}
              key={index}
            >
              <DataGrid
                density={"compact"}
                columns={table.columns}
                rows={table.data}
                getRowHeight={() => "auto"}
                getRowId={(row: LinkedICREInfo) => row.id}
                sx={{ width: "100%", height: "auto" }}
                slots={{ toolbar: DataGridToolbar }}
                slotProps={{ toolbar: { title: table.name } }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Typography
              key={index}
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
              No ICREs found for {table.name}
            </Typography>
          )
        )}
      </Grid2>
    </Grid2>
  );
}

type TableDef = {
  name: string;
  data: LinkedICREInfo[];
  columns: GridColDef<LinkedICREInfo>[];
};

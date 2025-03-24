import {
  Box,
  CircularProgress,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import {
  ChIAPETCols,
  CrisprFlowFISHCols,
  eQTLCols,
  IntactHiCLoopsCols,
} from "./columns";

export default function LinkedGenes({ accession }: { accession: string }) {
  const { data, loading, error } = useLinkedGenes(accession);

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error: {error.message}</Typography>;

  // make types for the data
  const HiCLinked = data
    .filter((x: LinkedGeneInfo) => x.assay === "Intact-HiC")
    .map((x: LinkedGeneInfo, index: number) => ({ ...x, id: index.toString() }));
  const ChIAPETLinked = data
    .filter(
      (x: LinkedGeneInfo) =>
        x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET"
    )
    .map((x: LinkedGeneInfo, index: number) => ({ ...x, id: index.toString() }));
  const crisprLinked = data
    .filter((x: LinkedGeneInfo) => x.method === "CRISPR")
    .map((x: LinkedGeneInfo, index: number) => ({ ...x, id: index.toString() }));
  const eqtlLinked = data
    .filter((x: LinkedGeneInfo) => x.method === "eQTLs")
    .map((x: LinkedGeneInfo, index: number) => ({ ...x, id: index.toString() }));

  const tables = [
    { name: "Intact Hi-C Loops", data: HiCLinked, columns: IntactHiCLoopsCols },
    {
      name: "ChIA-PET Interactions",
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
  return (
    <Grid container spacing={2} flexDirection="column" sx={{ width: "100%" }}>
      <Grid size={{ xs: 12, md: 12 }}>
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
                getRowId={(row: LinkedGeneInfo) => row.id}
                sx={{ width: "100%", height: "auto" }}
                slots={{ toolbar: CustomToolbar }}
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
              No Genes found for {table.name}
            </Typography>
          )
        )}
      </Grid>
    </Grid>
  );
}

function CustomToolbar({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
      }}
    >
      <Typography variant="h4" pl={1}>
        {title}
      </Typography>
      <GridToolbar showQuickFilter title="Title" />
    </div>
  );
}

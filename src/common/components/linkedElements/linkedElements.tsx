import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import DataGridToolbar from "common/components/dataGridToolbar";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";

export default function LinkedElements({
  tables,
}: {
  tables: {
    name: string;
    data: LinkedICREInfo[] | LinkedGeneInfo[];
    columns: GridColDef<LinkedICREInfo | LinkedGeneInfo>[];
  }[];
}) {
  type rowType = LinkedICREInfo | LinkedGeneInfo;

  return (
    <Stack spacing={2}>
      {tables.map((table, index) =>
        table.data.length > 0 ? (
          <Box
            sx={{
              borderRadius: 1,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
            key={index}
          >
            <DataGridPro
              density={"compact"}
              columns={table.columns}
              rows={table.data}
              getRowHeight={() => "auto"}
              getRowId={(row: rowType) => row.id}
              sx={{ width: "100%", height: "auto" }}
              slots={{ toolbar: DataGridToolbar }}
              slotProps={{ toolbar: { title: table.name } }}
              pagination
              disableRowSelectionOnClick
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
            No {table.name} found
          </Typography>
        )
      )}
    </Stack>
  );
}

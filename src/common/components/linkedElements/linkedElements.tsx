import { Stack, Typography } from "@mui/material";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import CustomDataGrid, { CustomDataGridColDef } from "../CustomDataGrid";

export default function LinkedElements({
  tables,
}: {
  tables: {
    name: string;
    data: LinkedICREInfo[] | LinkedGeneInfo[];
    columns: CustomDataGridColDef<LinkedICREInfo | LinkedGeneInfo>[];
  }[];
}) {

  return (
    <Stack spacing={2}>
      {tables.map((table, index) =>
        table.data.length > 0 ? (
          <CustomDataGrid key={index} columns={table.columns} rows={table.data} tableTitle={table.name} />
        ) : (
          <Typography
            key={index}
            variant="h6"
            pl={1}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: 2,
            }}
          >
            No {table.name} found
          </Typography>
        )
      )}
    </Stack>
  );
}

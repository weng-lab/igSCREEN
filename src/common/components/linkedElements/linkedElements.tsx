import { Stack, Typography } from "@mui/material";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import CustomDataGrid, { CustomDataGridColDef, CustomDataGridProps } from "../CustomDataGrid";

export interface TableDef<T extends LinkedGeneInfo | LinkedICREInfo> extends CustomDataGridProps<T> {
  sortColumn: keyof T & string; // Constrain to string keys
  sortDirection: 'asc' | 'desc';
};

// Combined types for GridColDef and GridRenderCellParams for linkedGenes and linkedICREs
export type colDef = CustomDataGridColDef<LinkedGeneInfo> | CustomDataGridColDef<LinkedICREInfo>;

export default function LinkedElements<T extends LinkedGeneInfo | LinkedICREInfo>({
  tables,
}: {
  tables: TableDef<T>[];
}) {

  return (
    <Stack spacing={2}>
      {tables.map((table, index) =>
        table.rows.length > 0 ? (
          <CustomDataGrid
            key={index}
            initialState={{
              sorting: {
                sortModel: [{ field: table.sortColumn, sort: table.sortDirection }],
              },
            }}
            {...table}
          />
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
            No {table.tableTitle} found
          </Typography>
        )
      )}
    </Stack>
  );
}

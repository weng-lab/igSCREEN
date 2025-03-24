import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { Typography } from "@mui/material";

export default function DataGridToolbar({ title }: { title: string }) {
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
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: "Export data" },
            button: { variant: "text" },
          }}
        />
      </GridToolbarContainer>
    </div>
  );
}

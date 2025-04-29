import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid-pro";

import { Typography } from "@mui/material";

export default function DataGridToolbar({ title, variant = "h6" }: { title: string, variant?: "h4" | "h6" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
      }}
    >
      <Typography variant={variant} pl={1}>
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

import { Paper, PaperProps } from "@mui/material";
import { DataGridPro, DataGridProProps, gridClasses } from "@mui/x-data-grid-pro";
import DataGridToolbar from "./dataGridToolbar";
import { useMemo } from "react";

export interface CustomDataGridProps extends DataGridProProps {
  /**
   * Optional title to be used in the table toolbar
   */
  tableTitle?: string;
  /**
   * Elevation for wrapper MUI `<Paper>` component
   */
  elevation?: number;
  /**
   * Optional prop overrides for the underlying components
   */
  slotProps?: DataGridProProps["slotProps"] & {
    /**
     * The wrapper around the DataGrid which provides the box shadow
     */
    paper?: PaperProps;
  };
}

/**
 * Type safe field access
 * Optional tooltip for column headers
 */

const CustomDataGrid = (props: CustomDataGridProps) => {
  const { elevation, tableTitle, slotProps = {}, columns, rows, ...restDataGridProps } = props; // Default elevation and slotProps set
  const { paper: paperProps, ...restSlotProps } = slotProps;

  const rowsWithIds = useMemo(() => rows.map((row, index) => ({ ...row, id: row.id || index })), [rows]);

  return (
    <Paper elevation={elevation} {...paperProps}>
      <DataGridPro
        columns={columns}
        // handle undefined rows by providing fallback
        rows={rowsWithIds || []}
        getRowHeight={() => "auto"}
        disableRowSelectionOnClick
        slots={{ toolbar: DataGridToolbar }}
        slotProps={{ toolbar: { title: tableTitle }, ...restSlotProps }}
        pagination
        pageSizeOptions={[5, 10, 25, 100]}
        // set initial rows per page to first page size option
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: props.pageSizeOptions
                ? typeof props.pageSizeOptions[0] === "object"
                  ? props.pageSizeOptions[0].value
                  : props.pageSizeOptions[0]
                : 5,
            },
          },
        }}
        sx={{
          width: "100%",
          height: "auto",
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
        }}
        {...restDataGridProps}
      />
    </Paper>
  );
};

export default CustomDataGrid;

import { Box, Paper, PaperOwnProps, PaperProps, Tooltip, Typography } from "@mui/material";
import { DataGridPro, DataGridProProps, gridClasses, GridColDef } from "@mui/x-data-grid-pro";
import DataGridToolbar from "./dataGridToolbar";
import { useMemo } from "react";
import { InfoOutlined } from "@mui/icons-material";

export type CustomDataGridRow = Record<string, any>

export type CustomDataGridSlotProps = DataGridProProps["slotProps"] & {
  /**
   * The wrapper around the DataGrid which provides the box shadow
   */
  paper?: PaperProps;
};

export interface CustomDataGridProps<T extends CustomDataGridRow> extends DataGridProProps {
  /**
   * A set of columns of type `CustomDataGridColDef<Row>`, where `Row` is of type `CustomDataGridRow`
   */
  columns: CustomDataGridColDef<T>[];
  rows: Array<T>;
  /**
   * Optional title to be used in the table toolbar
   */
  tableTitle?: string;
  /**
   * Elevation for wrapper `Paper` element
   * @default 1
   */
  elevation?: PaperProps["elevation"];
  /**
   * Optional prop overrides for the underlying components
   */
  slotProps?: CustomDataGridSlotProps;
  /**
   * @default [5, 10, 25, 100]
   * @note Overrides MUI default
   */
  pageSizeOptions?: DataGridProProps["pageSizeOptions"]
  /**
   * @default true
   * @note Overrides MUI default
   */
  disableRowSelectionOnClick?: DataGridProProps["disableRowSelectionOnClick"]
}

export type CustomDataGridColDef<T extends CustomDataGridRow> = GridColDef & {
  /**
   * Attribute of the row object to be used for the column
   */
  field: keyof T;
  /**
   * Optional tooltip to be displayed with info icon in column header
   */
  tooltip?: string;
};

const CustomDataGrid = <T extends CustomDataGridRow>(props: CustomDataGridProps<T>) => {
  /**
   * Provide defaults
   * @todo obey the defaults specified in the theme. 
   * Ex: Overriding pageSizeOptions like this overrides the defaults specified in the theme
   */
  const {
    elevation, // don't provide elevation default so that it's default obeys the MUI theme 
    tableTitle,
    slotProps = {},
    pageSizeOptions = [5, 10, 25, 100],
    columns,
    rows = [],
    ...restDataGridProps
  } = props;
  const { paper: paperProps, ...restSlotProps } = slotProps;

  const rowsWithIds = useMemo(() => rows.map((row, index) => ({ ...row, id: row?.id || index })), [rows]);

  /**
   * @todo figure out which built in features I am removing when building in row spacing defaults. Maybe provide some prop to optionally use the default column spacing styles
   */

  const columnsModified: CustomDataGridColDef<T>[] = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        renderHeader: col.tooltip ? (params) => {
          return (
            <Box display="inline-flex" alignItems="center">
              {col.renderHeader ? (
                <col.renderHeader {...params} />
              ) : (
                <Typography variant="inherit">{col?.headerName ?? col.field}</Typography>
              )}
              <Tooltip title={col.tooltip}>
                <InfoOutlined sx={{ fontSize: "inherit", marginLeft: 0.5 }} />
              </Tooltip>
            </Box>
          );
        } : undefined,
      })),
    [columns]
  );

  return (
    <Paper elevation={elevation} {...paperProps}>
      <DataGridPro
        columns={columnsModified}
        rows={rowsWithIds}
        getRowHeight={() => "auto"}
        disableRowSelectionOnClick
        slots={{ toolbar: DataGridToolbar }}
        slotProps={{ toolbar: { title: tableTitle }, ...restSlotProps }}
        pagination
        pageSizeOptions={pageSizeOptions}
        // set initial rows per page to first page size option. Page sizes can be array of numbers or objects with value/label
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: typeof pageSizeOptions[0] === "object" ? pageSizeOptions[0].value : pageSizeOptions[0],
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

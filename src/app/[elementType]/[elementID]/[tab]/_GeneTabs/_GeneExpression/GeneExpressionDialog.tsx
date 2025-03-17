import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, DialogContent, useTheme, useMediaQuery, IconButton, Stack } from "@mui/material";
import { blue } from "@mui/material/colors";
import { PointMetadata } from "./GeneExpression";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { getCellCategoryDisplayname } from "common/utility";
import { Close } from "@mui/icons-material";

export interface SimpleDialogProps {
  open: boolean
  onClose: () => void
  selected: PointMetadata[]
}

const GeneExpressionDialog = (props: SimpleDialogProps) => {
  const { onClose, open, selected } = props

  const handleClose = () => {
    onClose()
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const columns: GridColDef<PointMetadata>[] = [
    {
      field: 'description',
      headerName: 'Cell Type',
      width: 200
    },
    {
      field: 'source',
      headerName: 'Source',
      description: 'This column has a value getter and is not sortable.',
      width: 90,
    },
    {
      field: 'expid',
      headerName: 'Experiment ID',
      width: 120
    },
    {
      field: 'stimulation',
      headerName: 'Stimulation',
    },
    {
      field: 'celltype',
      headerName: 'Grouping',
      width: 130,
      valueGetter: (_, row) => getCellCategoryDisplayname(row.celltype)
    },
    {
      field: 'value',
      headerName: 'TPM',
      type: 'number',
      width: 100,
    },
  ];

  return (
    <Dialog onClose={handleClose} open={open} fullScreen={fullScreen} maxWidth={false}>
      <DialogTitle>
        Selected Points
      </DialogTitle>
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 16
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <DataGrid
          rows={selected}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{ field: 'value', sort: 'desc' }]
            }
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          pageSizeOptions={[10, 25, 50]}
          getRowId={(row) => row.name}
        />
      </DialogContent>
    </Dialog>
  );
}

export default GeneExpressionDialog
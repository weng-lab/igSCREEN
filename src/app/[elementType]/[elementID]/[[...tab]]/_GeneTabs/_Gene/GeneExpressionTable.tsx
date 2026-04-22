import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { IconButton, Link, Typography } from "@mui/material";
import { getCellCategoryDisplayname, getStudyLink } from "common/utility";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid-premium";
import { OpenInNew } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";
import { Table, TableColDef } from "@weng-lab/ui-components";

export type GeneExpressionTableProps = GeneExpressionProps &
  SharedGeneExpressionPlotProps & {
    onSelectionChange: (selected: PointMetadata[]) => void;
    setSortedFilteredData: Dispatch<SetStateAction<PointMetadata[]>>;
  };

const GeneExpressionTable = ({
  geneData,
  selected,
  onSelectionChange,
  geneExpressionData,
  setSortedFilteredData,
  sortedFilteredData,
}: GeneExpressionTableProps) => {
  const { data, loading, error } = geneExpressionData;

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) => (
    <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>
  );

  const columns: TableColDef<PointMetadata>[] = [
    {
      ...(GRID_CHECKBOX_SELECTION_COL_DEF as TableColDef<PointMetadata>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
      sortable: true,
      hideable: false,
      renderHeader: StopPropagationWrapper,
    },
    {
      field: "biosample",
      headerName: "Biosample",
    },
    {
      field: "value",
      headerName: "TPM",
      type: "number",
      valueGetter: (_, row) => row.value.toFixed(1),
    },
    {
      field: "stimulation",
      headerName: "Stimulation",
      valueGetter: (_, row) => (row.stimulation.charAt(0) === "u" ? "Unstim" : "Stim"),
    },
    {
      field: "lineage",
      headerName: "Lineage",
      valueGetter: (_, row) => getCellCategoryDisplayname(row.lineage),
    },
    {
      field: "link",
      headerName: "Experiment",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <IconButton href={params.value} target="_blank" size="small">
            <OpenInNew fontSize="small" />
          </IconButton>
        );
      },
    },
    {
      field: "study",
      headerName: "Study",
      renderCell: (params) => {
        return (
          <Link href={getStudyLink(params.value)} target="_blank">
            {params.value}
          </Link>
        );
      },
    },
  ];

  const handleRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedRows = [...rowSelectionModel.ids.values().map((id) => data.find((row) => row.name === id))];
    onSelectionChange(selectedRows);
  };

  const apiRef = useGridApiRef();

  const arraysAreEqual = (arr1: PointMetadata[], arr2: PointMetadata[]): boolean => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].name !== arr2[i].name) {
        return false;
      }
    }
    return true;
  };

  const handleSync = () => {
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as PointMetadata[];
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      setSortedFilteredData(rows);
    }
  };

  return (
    <Table
      apiRef={apiRef}
      label={
        <Typography variant="h6">
          <i>{geneData?.data.name}</i> Expression
        </Typography>
      }
      density="standard"
      rows={data}
      columns={columns}
      loading={loading}
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        sorting: {
          sortModel: [{ field: "value", sort: "desc" }],
        },
      }}
      checkboxSelection
      getRowId={(row) => row.name} //needed to match up data with the ids returned by onRowSelectionModelChange
      onRowSelectionModelChange={handleRowSelectionModelChange}
      rowSelectionModel={{type: "include", ids: new Set(selected.map(x => x.name))}}
      keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
      onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
    />
  );
};

export default GeneExpressionTable;

import { PointMetadata } from "./GeneExpression";
import { IconButton, Link, Typography } from "@mui/material";
import { getCellCategoryDisplayname, getStudyLink } from "common/utility";
import { OpenInNew } from "@mui/icons-material";
import { Table, TableColDef, useSyncedTable, useTablePlotSync } from "@weng-lab/ui-components";
import { UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
import { UseGeneDataReturn } from "common/hooks/useGeneData";

export type GeneExpressionTableProps = {
  geneData: UseGeneDataReturn<{ name: string }>;
  tableProps: ReturnType<typeof useTablePlotSync<PointMetadata>>["tableProps"];
  geneExpressionData: UseGeneExpressionReturn;
};

const GeneExpressionTable = ({
  geneData,
  tableProps,
  geneExpressionData,
}: GeneExpressionTableProps) => {
  const { data, loading } = geneExpressionData;

  const columns: TableColDef<PointMetadata>[] = [
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

  const { syncedTableProps } = useSyncedTable({
    tableProps,
    columns,
    initialSort: [{ field: "value", sort: "desc" }],
    isPresorted: false,
  });

  return (
    <Table
      {...syncedTableProps}
      divHeight={{ height: 400 }}
      label={
        <Typography variant="h6">
          <i>{geneData?.data.name}</i> Expression
        </Typography>
      }
      density="standard"
      rows={data}
      loading={loading}
      pageSizeOptions={[10, 25, 50]}
    />
  );
};

export default GeneExpressionTable;

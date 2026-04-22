import { IconButton, Link } from "@mui/material";
import { getCellCategoryDisplayname, getStudyLink } from "common/utility";
import { IcreActivityProps, PointMetadata } from "./IcreActivity";
import { OpenInNew } from "@mui/icons-material";
import { Table, TableColDef, useSyncedTable, useTablePlotSync } from "@weng-lab/ui-components";
import { UseIcreActivityReturn } from "common/hooks/useIcreActivity";

export type IcreActivityTableProps = {
  accession: IcreActivityProps["accession"];
  tableProps: ReturnType<typeof useTablePlotSync<PointMetadata>>["tableProps"];
  iCREActivitydata: UseIcreActivityReturn;
};

const IcreActivityTable = ({ accession, tableProps, iCREActivitydata }: IcreActivityTableProps) => {
  const { data, loading } = iCREActivitydata;

  const columns: TableColDef<PointMetadata>[] = [
    {
      field: "biosample",
      headerName: "Biosample",
    },
    {
      field: "assay",
      headerName: "Assay",
    },
    {
      field: "value",
      headerName: "Z-score",
      type: "number",
      valueFormatter: (value?: number) => (value ? value.toFixed(2) : "null"),
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
      label={`${accession} Activity`}
      divHeight={{ height: 400 }}
      density="standard"
      rows={data}
      loading={loading}
      pageSizeOptions={[10, 25, 50]}
    />
  );
};

export default IcreActivityTable;

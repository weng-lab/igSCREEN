'use client'
import { Link as MuiLink, Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useSnpData, UseSnpDataReturn } from "common/hooks/useSnpData";
import Link from "next/link";
import DataGridToolbar from "common/components/dataGridToolbar";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { LinkComponent } from "common/utility";

const IntersectingSNPs = ({ region }: { region: GenomicRange }) => {
  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({ coordinates: { chromosome: region.chromosome, start: region.start, end: region.end } });

  type RowObj = (typeof dataSnps)[number];

  const columns: CustomDataGridColDef<RowObj>[] = [
    {
      field: "id",
      headerName: "rsID",
      renderCell: (params) => (
        <LinkComponent href={`/variant/${params.value}`} underline="hover">
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "coordinates",
      headerName: "Coordinates",
      valueGetter: (_, row: RowObj) =>
        `${
          row.coordinates.chromosome
        }:${row.coordinates.start.toLocaleString()}-${row.coordinates.end.toLocaleString()}`,
    },
  ];

  return errorSnps ? (
    <Typography>Error Fetching SNPs</Typography>
  ) : (
    <CustomDataGrid
      rows={dataSnps}
      columns={columns}
      loading={loadingSnps}
      initialState={{
        sorting: {
          sortModel: [{ field: "coordinates", sort: "asc" }],
        },
      }}
      tableTitle="Intersecting Variants"
      pageSizeOptions={[10, 25, 50, 100]}
    />
  );
};

export default IntersectingSNPs
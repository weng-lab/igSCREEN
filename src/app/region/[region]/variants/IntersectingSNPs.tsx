'use client'
import { Link as MuiLink, Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useSnpData, UseSnpDataReturn } from "common/hooks/useSnpData";
import Link from "next/link";
import DataGridToolbar from "common/components/dataGridToolbar";

const IntersectingSNPs = ({ region }: { region: GenomicRange }) => {
  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({ coordinates: { chromosome: region.chromosome, start: region.start, end: region.end } });

  // ensure that "field" is accessing a true property of the row
  type TypeSafeColDef<T> = GridColDef & { field: keyof T };

  type RowObj = UseSnpDataReturn<{ coordinates: GenomicRange }>["data"][number]

  const columns: TypeSafeColDef<RowObj>[] = [
    {
      field: "id",
      headerName: "rsID",
      width: 130,
      renderCell: (params) => (
        <MuiLink href={`/variant/${params.value}`} component={Link}>
          {params.value}
        </MuiLink>
      ),
    },
    {
      field: "coordinates",
      headerName: "Coordinates",
      width: 250,
      valueGetter: (_, row: RowObj) =>
        `${
          row.coordinates.chromosome
        }:${row.coordinates.start.toLocaleString()}-${row.coordinates.end.toLocaleString()}`,
    },
  ];

  return errorSnps ? (
    <Typography>Error Fetching SNPs</Typography>
  ) : (
    <DataGridPro
      rows={dataSnps || []}
      columns={columns}
      loading={loadingSnps}
      pagination
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
        sorting: {
          sortModel: [{ field: "coordinates", sort: "asc" }],
        },
      }}
      slots={{ toolbar: DataGridToolbar }}
      slotProps={{ toolbar: { showQuickFilter: true, title: "Intersecting SNPs", sx: { p: 1 } } }}
      pageSizeOptions={[10, 25, 50]}
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
    />
  );
};

export default IntersectingSNPs
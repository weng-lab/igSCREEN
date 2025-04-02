'use client'
import { Link as MuiLink, Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { DataGridPro, GridColDef, GridToolbar } from "@mui/x-data-grid-pro";
import { useSnpData, UseSnpDataReturn } from "common/hooks/useSnpData";
import Link from "next/link";

const IntersectingSNPs = ({ region }: { region: GenomicRange }) => {
  const { data: dataSnps, loading: loadingSnps, error: errorSnps } = useSnpData({ coordinates: region });

  // ensure that "field" is accessing a true property of the row
  type TypeSafeColDef<T> = GridColDef & { field: keyof T };

  type RowObj = UseSnpDataReturn<{ coordinates: GenomicRange }>["data"][number]

  const columns: TypeSafeColDef<RowObj>[] = [
    {
      field: "id",
      headerName: "rsID",
      width: 130,
      renderCell: (params) => (
        <MuiLink href={`/snp/${params.value}`} component={Link}>
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
      columns={columns.map((col) => {
        return { ...col };
      })}
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
      slots={{ toolbar: GridToolbar }}
      slotProps={{ toolbar: { showQuickFilter: true, sx: { p: 1 } } }}
      pageSizeOptions={[10, 25, 50]}
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
      getRowHeight={() => "auto"}
    />
  );
};

export default IntersectingSNPs
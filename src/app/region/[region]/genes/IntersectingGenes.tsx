'use client'
import { Link as MuiLink, Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { DataGridPro, GridColDef, GridToolbar } from "@mui/x-data-grid-pro";
import Link from "next/link";
import { useGeneData, UseGeneDataReturn } from "common/hooks/useGeneData";


const IntersectionGenes = ({ region }: { region: GenomicRange }) => {
  const { data: dataSnps, loading: loadingSnps, error: errorSnps } = useGeneData({ coordinates: region });

  // ensure that "field" is accessing a true property of the row
  type TypeSafeColDef<T> = GridColDef & { field: keyof T };

  type RowObj = UseGeneDataReturn<{ coordinates: GenomicRange }>["data"][number];

  const columns: TypeSafeColDef<RowObj>[] = [
    {
      field: "name",
      headerName: "Symbol",
      width: 130,
      renderCell: (params) => (
        <MuiLink href={`/snp/${params.value}`} component={Link}>
          {params.value}
        </MuiLink>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 170,
    },
    {
      field: "strand",
      headerName: "Strand"
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

export default IntersectionGenes
import { Box, Skeleton, Typography } from "@mui/material";
import useGWASLdr from "common/hooks/useGWASLdr";
import DataGridToolbar from "common/components/dataGridToolbar";
import { DataGridPro, gridClasses, GridColDef } from "@mui/x-data-grid-pro";
import { LinkComponent } from "common/utility";

export default function GWASLdr({ accession }: { accession: string }) {
  const { data, loading, error } = useGWASLdr([accession]);

  const cols: GridColDef[] = [
    {
      field: "snpid",
      headerName: "SNP ID",
      renderCell: (params) => (
        <LinkComponent href={"/snp/" + params.value} underline="hover">
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "snp_chr",
      headerName: "Chr",
      width: 100
    },
    {
      field: "snp_start",
      headerName: "Position",
      renderCell: (params) => {
        return params.value.toLocaleString();
      },
    },
    {
      field: "ref_allele",
      headerName: "Ref Allele",
    },
    {
      field: "effect_allele",
      headerName: "Effect Allele",
    },
    {
      field: "zscore",
      headerName: "Z-score",
      type: 'number',
      valueFormatter: (value?: number) => {
        if (value == null) {
          return '';
        }
        return `${value.toFixed(2)}`;
      },
    },
    {
      field: "disease",
      headerName: "Disease",
      width: 200,
      valueGetter: (value, row) => {
        return value === "" ? row.study_source : value
      },
    },
    {
      field: "study_source",
      headerName: "Source",
    },
  ];

  return (
    <Box width={"100%"}>
      {loading ? (
        <Skeleton variant="rounded" width={"100%"} height={100} />
      ) : data.length > 0 ? (
        <DataGridPro
          rows={data || []}
          columns={cols.map(col => { return { ...col, display: 'flex' } })}
          getRowId={(row) => row.zscore + row.study}
          pagination
          initialState={{
            sorting: {
              sortModel: [{ field: "zscore", sort: "desc" }],
            },
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          slots={{ toolbar: DataGridToolbar }}
          slotProps={{ toolbar: { title: "GWAS Ldr" } }}
          getRowHeight={() => 'auto'}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 1,
            },
          }}
          disableRowSelectionOnClick
        />
      ) : (
        <Typography
          variant="h6"
          pl={1}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            p: 2,
            marginBottom: 2,
          }}
        >
          No GWAS LDR data found
        </Typography>
      )}
    </Box>
  );
}

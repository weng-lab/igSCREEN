import { Box, Skeleton, Typography } from "@mui/material";
import useGWASLdr from "common/hooks/useGWASLdr";
import DataGridToolbar from "common/components/dataGridToolbar";
import { DataGridPro, gridClasses, GridColDef } from "@mui/x-data-grid-pro";
import { LinkComponent } from "common/utility";

export default function SnpGWASLdr({ snpid }: { snpid: string }) {
  const { data, loading, error } = useGWASLdr(undefined, [snpid]);

  const cols: GridColDef[] = [
    {
      field: "icre",
      headerName: "Accession",
      width: 150,
      renderCell: (params) => (
        <LinkComponent href={"/icre/" + params.value} underline="hover">
          {params.value}
        </LinkComponent>
      ),
    },

    {
      field: "effect_allele",
      headerName: "A1",
    },
    {
      field: "ref_allele",
      headerName: "A2",
    },
    {
      field: "zscore",
      headerName: "Z-score",
      type: "number",
      valueFormatter: (value?: number) => {
        if (value == null) {
          return "";
        }
        return `${value.toFixed(2)}`;
      },
    },
    {
      field: "disease",
      headerName: "Disease",
      width: 200,
      valueGetter: (value, row) => {
        return value === "" ? row.study_source : value;
      },
    },
    {
      field: "study_source",
      headerName: "Source",
    },
    {
      field: "author",
      headerName: "Author",
      renderCell: (params) => {
        return params.value ? `${params.value.replace(/(\d+)$/, " $1")}` : <></>
      },
    },
  ];

  return (
    <Box width={"100%"}>
      {loading ? (
        <Skeleton variant="rounded" width={"100%"} height={100} />
      ) : data.length > 0 ? (
        <Box sx={{ flex: "1 1 auto" }}>
          <DataGridPro
            rows={data || []}
            columns={cols.map((col) => {
              return { ...col, display: "flex" };
            })}
            getRowId={(row) => row.zscore + row.study}
            pagination
            initialState={{
              sorting: {
                sortModel: [{ field: "zscore", sort: "desc" }],
              },
              pagination: {
                paginationModel: {
                  pageSize: 5,
                  page: 0,
                },
              },
            }}
            pageSizeOptions={[5, 10]}
            slots={{ toolbar: DataGridToolbar }}
            slotProps={{ toolbar: { title: "GWAS Variants" } }}
            getRowHeight={() => "auto"}
            sx={{
              [`& .${gridClasses.cell}`]: {
                py: 1,
              },
            }}
            disableRowSelectionOnClick
          />
        </Box>
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
          No GWAS Variants data found
        </Typography>
      )}
    </Box>
  );
}

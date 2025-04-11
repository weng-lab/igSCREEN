import { Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import useGWASLdr from "common/hooks/useGWASLdr";
import DataGridToolbar from "common/components/dataGridToolbar";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { Link as MuiLink } from "@mui/material";
import Link from "next/link";

export default function SnpGWASLdr({ snpid }: { snpid: string }) {
  const { data, loading, error } = useGWASLdr(undefined, [snpid]);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        {loading ? (
          <Skeleton variant="rounded" width={"100%"} height={100} />
        ) : data.length > 0 ? (
          <>
            <DataGridPro
              rows={data || []}
              columns={
                [
                  {
                    field: "icre",
                    headerName: "Accession",
                    flex: 1,
                    renderCell: (params) => {
                      return params.value ? (
                        <MuiLink component={Link} href={"/icre/" + params.value}>
                          <i>{params.value}</i>
                        </MuiLink>
                      ) : (
                        "."
                      );
                    },
                  },
                  {
                    field: "ref_allele",
                    headerName: "Ref Allele",
                    flex: 1,
                  },
                  {
                    field: "effect_allele",
                    headerName: "Effect Allele",
                    flex: 1,
                  },
                  {
                    field: "zscore",
                    headerName: "Z-score",
                    flex: 1,
                    renderCell: (params) => {
                      return params.value.toFixed(2);
                    },
                  },
                  {
                    field: "disease",
                    headerName: "Disease",
                    flex: 1,
                    renderCell: (params) => {
                      return params.value == "" ? params.row.study_source : params.value;
                    },
                  },
                  {
                    field: "study_source",
                    headerName: "Source",
                    flex: 1,
                  },
                ] as GridColDef[]
              }
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
              density="compact"
              sx={{ width: "100%", height: "auto" }}
              style={{ boxShadow: "0px 6px 12px rgba(0,0,0,0.2)" }}
            />
          </>
        ) : (
          <Typography
            variant="h6"
            pl={1}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              marginBottom: 2,
            }}
          >
            No GWAS ldr data found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

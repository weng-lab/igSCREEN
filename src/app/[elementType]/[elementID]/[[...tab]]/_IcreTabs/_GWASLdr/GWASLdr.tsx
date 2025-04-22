import { Box, Skeleton, Typography } from "@mui/material";
import useGWASLdr from "common/hooks/useGWASLdr";
import DataGridToolbar from "common/components/dataGridToolbar";
import { DataGridPro, gridClasses, GridColDef } from "@mui/x-data-grid-pro";
import { LinkComponent } from "common/utility";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";

export default function GWASLdr({ accession }: { accession: string }) {
  const { data, loading, error } = useGWASLdr([accession]);

  let snpids= [...new Set(data?.map((l) => l.snpid))]
  const snpAlleles= useSnpFrequencies(snpids)
  
  const gwasnps =  data?.map(d=>{
    let zscore = d.zscore
    
    //reverse zscore 
    if(d.effect_allele === snpAlleles.data[d.snpid]?.alt && d.ref_allele ===  snpAlleles.data[d.snpid]?.ref )
    {
      zscore = d.zscore < 0 ? d.zscore :  -d.zscore
    }
    return {
      ...d,
      zscore
    }
  })
  const cols: GridColDef[] = [
    {
      field: "snpid",
      headerName: "rs ID",
      renderCell: (params) => (
        <LinkComponent href={"/variant/" + params.value} underline="hover">
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "snp_chr",
      headerName: "Chromosome",
      width: 100,
    },
    {
      field: "snp_start",
      headerName: "Position",
      renderCell: (params) => {
        return params.value.toLocaleString();
      },
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
          field: "study_link",
          flex: 1,
          display: "flex",
          headerName: "Study",
          width: 100,
          renderCell: (params) => {
           
            return (
              <LinkComponent
                underline="hover"
                href={params.value}        
                showExternalIcon={!params.row.isiCRE}
                openInNewTab={!params.row.isiCRE}
              >
                {params.value}
              </LinkComponent>
            );
          },
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
            rows={gwasnps || []}
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
            density="compact"
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

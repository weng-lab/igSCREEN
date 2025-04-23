import { Box, Skeleton, Typography } from "@mui/material";

import DataGridToolbar from "common/components/dataGridToolbar";
import { DataGridPro, gridClasses, GridColDef } from "@mui/x-data-grid-pro";
import { LinkComponent } from "common/utility";
import { GenomicRange } from "types/globalTypes";

import useNearbycCREs from "common/hooks/useNearBycCREs";
import useCcreDetails from "common/hooks/useCcreDetails";

export default function NearbycCREs({ geneid, coordinates, allcCREs }: { geneid: string, coordinates: GenomicRange, allcCREs: boolean }) {
    const { data, loading, error } = useNearbycCREs(geneid);
    
    const { data: ccreData, loading: ccreLoading, error: ccreError } = useCcreDetails(data?.map(d=>d.ccre));    

    const nearbyccres = data?.map(d=>{
        let f = ccreData?.find(c=>c.accession === d.ccre)
        return {
            ...d,
            chromosome: f?.coordinates.chromosome,
            start: f?.coordinates.start,
            end: f?.coordinates.end,
            group: f?.group,
            distance: Math.abs(f?.coordinates.start-coordinates.start) || 0

        }
    })?.filter(d => allcCREs || d.isiCRE);
    
  const cols: GridColDef[] = [
   
    {
      field: "ccre",
      flex: 1,
      display: "flex",
      headerName: "Accession",
      renderCell: (params) => {
        const href = !params.row.isiCRE
          ? `https://screen.wenglab.org/search/?q=${params.value}&uuid=0&assembly=GRCh38`
          : `/icre/${params.value}`;
        return (
          <LinkComponent
            underline="hover"
            href={href}        
            showExternalIcon={!params.row.isiCRE}
            openInNewTab={!params.row.isiCRE}
          >
            {params.value}
          </LinkComponent>
        );
      },
    },
    {
        field: "group",
        headerName: "Class",
        flex: 2,
      },
    {
        field: "chromosome",
        headerName: "Chromosome",
        flex: 2,
      },
      {
        field: "start",
        headerName: "Start",
        flex: 2,
        renderCell: (params) => {
            return params.value?.toLocaleString();
          },
      },
      {
        field: "end",
        headerName: "End",
        flex: 2,
        renderCell: (params) => {
            return params.value?.toLocaleString();
          },
      },
      {
        field: "distance",
        headerName: "Distance",
        flex: 2,
      },
  ];

  return (
    <Box width={"100%"}>
      {loading ? (
        <Skeleton variant="rounded" width={"100%"} height={100} />
      ) : nearbyccres.length > 0 ? (
        <Box sx={{ flex: "1 1 auto" }}>
          <DataGridPro
            rows={nearbyccres || []}
            columns={cols.map((col) => {
              return { ...col, display: "flex" };
            })}
            getRowId={(row) => row.ccre}
            pagination
            initialState={{
                sorting: {
                    sortModel: [{ field: "distance", sort: "asc" }],
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
            slotProps={{ toolbar: { title: "Nearby cCREs" } }}
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
          No Nearby cCREs found
        </Typography>
      )}
    </Box>
  );
}

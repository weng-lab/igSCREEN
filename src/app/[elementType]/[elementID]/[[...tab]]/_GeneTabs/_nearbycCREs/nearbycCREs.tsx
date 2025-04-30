import { Box, Skeleton, Typography } from "@mui/material";
import { LinkComponent } from "common/utility";
import { GenomicRange } from "types/globalTypes";
import useNearbycCREs from "common/hooks/useNearBycCREs";
import useCcreDetails from "common/hooks/useCcreDetails";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { useMemo } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";

export default function NearbycCREs({
  geneid,
  coordinates,
  allcCREs,
}: {
  geneid: string;
  coordinates: GenomicRange;
  allcCREs: boolean;
}) {
  const { data, loading, error } = useNearbycCREs(geneid);

  const { data: ccreData, loading: ccreLoading, error: ccreError } = useCcreDetails(data?.map((d) => d.ccre));

  const nearbyccres = data
    ?.map((d) => {
      let f = ccreData?.find((c) => c.accession === d.ccre);
      return {
        ...d,
        chromosome: f?.coordinates.chromosome,
        start: f?.coordinates.start,
        end: f?.coordinates.end,
        group: f?.group,
        distance: Math.abs(f?.coordinates.start - coordinates.start) || 0,
      };
    })
    ?.filter((d) => allcCREs || d.isiCRE);

  const cols: CustomDataGridColDef<(typeof nearbyccres)[number]>[] = [
    {
      field: "ccre",
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
      tooltip: (
        <div>
          See{" "}
          <LinkComponent
            openInNewTab
            color="inherit"
            showExternalIcon
            href={"https://screen.wenglab.org/about#classifications"}
          >
            SCREEN
          </LinkComponent>{" "}
          for Class definitions
        </div>
      ),
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
    },
    {
      field: "start",
      headerName: "Start",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "end",
      headerName: "End",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "distance",
      headerName: "Distance",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
  ]

  return (
    <Box width={"100%"}>
      {loading ? (
        <Skeleton variant="rounded" width={"100%"} height={100} />
      ) : nearbyccres.length > 0 ? (
        <Box sx={{ flex: "1 1 auto" }}>
          <CustomDataGrid
            rows={nearbyccres}
            columns={cols}
            tableTitle={allcCREs ? "Nearby cCREs" : "Nearby iCREs"}
            initialState={{
              sorting: {
                sortModel: [{ field: "distance", sort: "asc" }],
              },
            }}
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

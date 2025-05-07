import { Box, Skeleton } from "@mui/material";
import useNearbycCREs from "common/hooks/useNearBycCREs";
import useCcreDetails from "common/hooks/useCcreDetails";
import { CustomDataGrid, CustomDataGridColDef } from "common/components/CustomDataGrid";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { LinkComponent } from "common/components/LinkComponent";

export default function DistanceLinkedCcres({
  geneData,
  allcCREs,
}: {
  geneData: UseGeneDataReturn<{ name: string }>;
  allcCREs: boolean;
}) {
  const { data: dataNearby, loading: loadingNearby, error: errorNearby } = useNearbycCREs(geneData?.data.id);

  const {
    data: dataCcreDetails,
    loading: loadingCcreDetails,
    error: errorCcreDetails,
  } = useCcreDetails(dataNearby?.map((d) => d.ccre));

  const nearbyccres = dataNearby
    ?.map((d) => {
      let f = dataCcreDetails?.find((c) => c.accession === d.ccre);
      return {
        ...d,
        chromosome: f?.coordinates.chromosome,
        start: f?.coordinates.start,
        end: f?.coordinates.end,
        group: f?.group,
        distance: Math.abs(f?.coordinates.start - geneData?.data.coordinates.start) || 0,
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
          <LinkComponent href={href} showExternalIcon={!params.row.isiCRE} openInNewTab={!params.row.isiCRE}>
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
  ];

  return (
    <Box width={"100%"}>
      {geneData.loading || loadingNearby || loadingCcreDetails ? (
        <Skeleton variant="rounded" width={"100%"} height={100} />
      ) : (
        <CustomDataGrid
          rows={nearbyccres}
          columns={cols}
          tableTitle={allcCREs ? "Nearby cCREs" : "Nearby iCREs"}
          initialState={{
            sorting: {
              sortModel: [{ field: "distance", sort: "asc" }],
            },
          }}
          emptyTableFallback={allcCREs ? "No Nearby cCREs found" : "No Nearby iCREs found"}
        />
      )}
    </Box>
  );
}

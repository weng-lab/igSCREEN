'use client'
import { Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { useSnpData } from "common/hooks/useSnpData";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "./LinkComponent";

const IntersectingSNPs = ({ region }: { region: GenomicRange }) => {
  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({ coordinates: { chromosome: region.chromosome, start: region.start, end: region.end } });

  type RowObj = (typeof dataSnps)[number];

  const columns: TableColDef<RowObj>[] = [
    {
      field: "id",
      headerName: "rsID",
      renderCell: (params) => (
        <LinkComponent href={`/variant/${params.value}`}>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "coordinates",
      headerName: "Coordinates",
      valueGetter: (_, row: RowObj) =>
        `${
          row.coordinates.chromosome
        }:${row.coordinates.start.toLocaleString()}-${row.coordinates.end.toLocaleString()}`,
    },
  ];

  return errorSnps ? (
    <Typography>Error Fetching SNPs</Typography>
  ) : (
    <Table
      rows={dataSnps}
      columns={columns}
      loading={loadingSnps}
      initialState={{
        sorting: {
          sortModel: [{ field: "coordinates", sort: "asc" }],
        },
      }}
      label="Intersecting Variants"
      pageSizeOptions={[10, 25, 50, 100]}
      emptyTableFallback={"No intersecting variants found in this region"}
    />
  );
};

export default IntersectingSNPs
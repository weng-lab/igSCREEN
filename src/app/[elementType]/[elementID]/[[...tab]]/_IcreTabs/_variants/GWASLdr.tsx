import { Box, Skeleton, Typography } from "@mui/material";
import useGWASLdr from "common/hooks/useGWASLdr";
import { LinkComponent } from "common/utility";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";
import { useMemo } from "react";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";

export default function GWASLdr({ accession }: { accession: string }) {
  const { data, loading, error } = useGWASLdr([accession]);
  const snpids = [...new Set(data?.map((l) => l.snpid))];
  const { data: snpAlleles, loading: loadingSnpAlleles } = useSnpFrequencies(snpids);

  const gwasSnps = useMemo(() => {
    if (!data || !snpAlleles) return undefined;
    return data.map((d) => {
      let zscore = d.zscore;

      //reverse zscore
      if (d.effect_allele === snpAlleles[d.snpid]?.alt && d.ref_allele === snpAlleles[d.snpid]?.ref) {
        zscore = d.zscore < 0 ? d.zscore : -d.zscore;
      }
      return {
        ...d,
        zscore,
      };
    });
  }, [data, snpAlleles]);

  const cols: CustomDataGridColDef<(typeof gwasSnps)[number]>[] = [
    {
      field: "snpid",
      headerName: "rsID",
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
      headerName: "Study",
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
        return params.value ? `${params.value.replace(/(\d+)$/, " $1")}` : <></>;
      },
    },
  ];

  return (
    <Box width={"100%"}>
      {loading ? (
        <Skeleton variant="rounded" width={"100%"} height={100} />
      ) : data.length > 0 ? (
        <Box sx={{ flex: "1 1 auto" }}>
          <CustomDataGrid
            rows={gwasSnps}
            columns={cols}
            loading={loading || loadingSnpAlleles}
            initialState={{
              sorting: {
                sortModel: [{ field: "zscore", sort: "desc" }],
              },
            }}
            tableTitle={`GWAS Variants for ${accession}`}
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
          }}
        >
          No GWAS Variants data found
        </Typography>
      )}
    </Box>
  );
}

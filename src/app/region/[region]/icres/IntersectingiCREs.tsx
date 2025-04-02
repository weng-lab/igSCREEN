"use client";

import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Link as MuiLink, Skeleton, Typography } from "@mui/material";
import { ExternalLink, getCellCategoryDisplayname, getClassDisplayname } from "common/utility";
import { GenomicRange } from "types/globalTypes";
import { useRouter } from "next/navigation";
import { useIcreData, UseIcreDataReturn } from "common/hooks/useIcreData";
import { useIcreActivity, UseIcreActivityReturn } from "common/hooks/useIcreActivity";
import { useMemo } from "react";
import { ExpandMore } from "@mui/icons-material";
import { DataGridPro, GridColDef, GridToolbar } from "@mui/x-data-grid-pro";
import Link from "next/link";

const IntersectingiCREs = ({ region }: { region: GenomicRange }) => {

  const { data: dataIcres, loading: loadingIcres, error: errorIcres } = useIcreData({ coordinates: region });

  const intersectingAccessions = useMemo(() => {
    if (!dataIcres) return null;
    return dataIcres.map((x) => x.accession);
  }, [dataIcres]);

  const {
    data: dataActivity,
    loading: loadingActivity,
    error: errorActivity,
  } = useIcreActivity({ accession: intersectingAccessions });

  const rowsNoExps = dataIcres || [];

  type ExpInfo = UseIcreActivityReturn["data"][number]

  /**
   * This could probably be made more efficient than O(n^2)
   */
  const rowsWithExps = rowsNoExps.map((row) => {
    let activeExps: {
      [lineage: string]: ExpInfo[];
    } = {};

    if (dataActivity)
      dataActivity.forEach((exp) => {
        //Cutoff for experiment activity set at 1.64
        if (exp.accession === row.accession && exp.value > 1.64) {
          if (activeExps[exp.lineage]) {
            activeExps[exp.lineage] = [...activeExps[exp.lineage], exp];
          } else {
            activeExps[exp.lineage] = [exp];
          }
        }
      });

    return { ...row, activeExps: activeExps };
  });

  // ensure that "field" is accessing a true property of the row
  type TypeSafeColDef<T> = GridColDef & { field: keyof T };

  type RowObj = UseIcreDataReturn<{ coordinates: GenomicRange }>["data"][number] & {activeExps: {[lineage: string]: ExpInfo[]}};

  const columns: TypeSafeColDef<RowObj>[] = [
    {
      field: "accession",
      headerName: "Accession",
      width: 130,
      renderCell: (params) => <MuiLink href={`/icre/${params.value}`} component={Link}>{params.value}</MuiLink>
    },
    {
      field: "group",
      headerName: "Class",
      type: "custom",
      width: 150,
      renderCell: (params) => getClassDisplayname(params.value)
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
    {
      field: "celltypes",
      headerName: "Active Celltypes",
      width: 250,
      sortComparator: (v1, v2) => v1.length - v2.length,
      renderCell: (params) => {
        const celltypes = params.value as RowObj["celltypes"];
        return (
          <Accordion sx={{width: '100%', background: "transparent"}} elevation={0}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{pX: 0}}>Active in {celltypes.length} Cell Types</AccordionSummary>
            <AccordionDetails>
              {celltypes.map((celltype, i) => (
                <Typography variant="body2" key={i}>
                  {celltype}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      },
    },
    {
      field: "activeExps",
      headerName: "Active Experiments",
      width: 300,
      sortComparator: (v1, v2) => Object.values(v1).flat().length - Object.values(v2).flat().length,
      renderCell: (params) => {
        const activeExps = params.value as RowObj["activeExps"];
        if (loadingActivity) return <Skeleton width={300} height={40} />
        return (
          <Accordion
            sx={{ width: "100%", background: "transparent" }}
            slotProps={{ transition: { unmountOnExit: true } }}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              Active in {Object.values(activeExps).flat().length} Experiments
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(activeExps).map(([lineage, exps], i) => (
                <Accordion key={i} elevation={0} sx={{ background: "transparent" }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    {getCellCategoryDisplayname(lineage)} ({exps.length})
                  </AccordionSummary>
                  <AccordionDetails>
                    {exps.map((exp, i) => (
                      <ExternalLink href={exp.link} showExternalIcon underline="hover" display={"block"} key={i}>
                        {exp.biosampleid} - {exp.source}
                      </ExternalLink>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      },
    },
  ];

  return errorIcres ? (
    <Typography>Error Fetching iCRES</Typography>
  ) : (
    <DataGridPro
      rows={rowsWithExps}
      columns={columns.map((col) => {
        return { ...col, display: "flex" };
      })}
      loading={loadingIcres}
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
      getRowId={(row) => row.accession}
      getRowHeight={() => "auto"}
    />
  )
};

export default IntersectingiCREs;

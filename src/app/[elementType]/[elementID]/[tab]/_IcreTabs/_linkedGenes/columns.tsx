import { Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { CreateLink, toScientificNotationElement } from "./createLink";

export const IntactHiCLoopsCols: GridColDef<LinkedGeneInfo>[] = [
  {
    field: "gene",
    flex: 1,
    headerName: "Common Gene Name",
    // renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => <GeneLink assembly={props.assembly} geneName={row.gene} />
  },
  {
    field: "genetype",
    flex: .75,
    headerName: "Gene Type",
    valueGetter: (value, row: LinkedGeneInfo) => row.genetype ? row.genetype === 'lncRNA' ? row.genetype : row.genetype.replaceAll('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : value,
  },
  {
    field: "assay",
    flex: 1,
    headerName: "Assay Type",
  },
  {
    field: "experiment_accession",
    flex: 1,
    headerName: "Experiment ID",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => <CreateLink linkPrefix="https://www.encodeproject.org/experiments/" linkArg={params.value} label={params.value} showExternalIcon underline="hover" />
  },
  {
    field: "displayname",
    flex: 3,
    headerName: "Biosample",
  },
  {
    field: "score",
    flex: .5,
    headerName: "Score",
  },
  {
    field: "p_val",
    flex: .5,
    headerName: "P",
    renderHeader: () => <Typography variant="body2"><i>P</i></Typography>,
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => params.value === 0 ? '0' : toScientificNotationElement(params.value, 2, {variant: "body2"})
  },
]


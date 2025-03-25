import { Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import {
  CreateLink,
  GeneLink,
  GeneTypeFormatter,
  toScientificNotationElement,
} from "./utils";

/** 
 * Column definitions for the linked genes tab. 
*/
export const geneNameCol: GridColDef<LinkedGeneInfo> = {
  field: "gene",
  flex: 1,
  minWidth: 150,
  display: "flex",
  headerName: "Common Gene Name",
  renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
    <Typography sx={{fontStyle: 'italic'}}><GeneLink geneName={params.value} /></Typography>
  ),
};

export const geneTypeCol: GridColDef<LinkedGeneInfo> = {
  field: "genetype",
  flex: 0.75,
  display: "flex",
  headerName: "Gene Type",
  valueGetter: (value, row: LinkedGeneInfo) => GeneTypeFormatter(value, row),
};

export const experimentCol: GridColDef<LinkedGeneInfo> = {
  field: "experiment_accession",
  flex: 1,
  minWidth: 150,
  display: "flex",
  headerName: "Experiment ID",
  renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
    <CreateLink
      linkPrefix="https://www.encodeproject.org/experiments/"
      linkArg={params.value}
      label={params.value}
      showExternalIcon
      underline="hover"
    />
  ),
};

export const displayNameCol: GridColDef<LinkedGeneInfo> = {
  field: "displayname",
  flex: 3,
  display: "flex",
  headerName: "Biosample",
  renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
    <Typography variant="body2" paddingBlock={1}>
      {params.value}
    </Typography>
  ),
};

export const scoreCol: GridColDef<LinkedGeneInfo> = {
  field: "score",
  flex: 0.5,
  display: "flex",
  headerName: "Score",
};

export const pValCol: GridColDef<LinkedGeneInfo> = {
  field: "p_val",
  flex: 0.75,
  display: "flex",
  headerName: "P",
  renderHeader: () => (
    <Typography variant="body2" pr={0.1}>
      <i>P</i>
    </Typography>
  ),
  renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) =>
    params.value === 0
      ? "0"
      : toScientificNotationElement(params.value, 2, { variant: "body2" }),
};

export const assayCol: GridColDef<LinkedGeneInfo> = {
  field: "assay",
  flex: 1,
  display: "flex",
  headerName: "Assay Type",
};

export const gRNACol: GridColDef<LinkedGeneInfo> = {
  field: "grnaid",
  flex: 1,
  minWidth: 200,
  display: "flex",
  headerName: "gRNA ID",
};

export const effectSizeCol: GridColDef<LinkedGeneInfo> = {
  field: "effectsize",
  flex: 0.75,
  display: "flex",
  headerName: "Effect Size",
};

export const variantIDCol: GridColDef<LinkedGeneInfo> = {
  field: "variantid",
  flex: 1.25,
  display: "flex",
  headerName: "Variant ID",
};

export const sourceCol: GridColDef<LinkedGeneInfo> = {
  field: "source",
  flex: 0.75,
  display: "flex",
  headerName: "Source",
};

export const tissueCol: GridColDef<LinkedGeneInfo> = {
  field: "tissue",
  flex: 2,
  display: "flex",
  headerName: "Tissue",
  renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
    <Typography variant="body2" paddingBlock={1}>
      {params.value}
    </Typography>
  ),
};

export const slopeCol: GridColDef<LinkedGeneInfo> = {
  field: "slope",
  flex: 0.75,
  display: "flex",
  headerName: "Slope",
};

/**
 * Table definitions for the linked genes tab.
 */
export const IntactHiCLoopsCols: GridColDef<LinkedGeneInfo>[] = [
  geneNameCol,
  geneTypeCol,
  experimentCol,
  displayNameCol,
  scoreCol,
  pValCol,
];

export const ChIAPETCols: GridColDef<LinkedGeneInfo>[] = [
  geneNameCol,
  geneTypeCol,
  assayCol,
  experimentCol,
  displayNameCol,
  scoreCol,
];

export const CrisprFlowFISHCols: GridColDef<LinkedGeneInfo>[] = [
  geneNameCol,
  {...geneTypeCol, flex: 1},
  gRNACol,
  {...experimentCol, flex: 1.25},
  displayNameCol,
  effectSizeCol,
  pValCol,
];

export const eQTLCols: GridColDef<LinkedGeneInfo>[] = [
  geneNameCol,
  geneTypeCol,
  variantIDCol,
  sourceCol,
  tissueCol,
  slopeCol,
  pValCol,
];
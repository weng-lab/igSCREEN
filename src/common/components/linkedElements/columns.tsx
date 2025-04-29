import { GridRenderCellParams } from "@mui/x-data-grid-pro";
import { Box, Typography } from "@mui/material";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { LinkComponent, toScientificNotationElement } from "common/utility";
import { CustomDataGridColDef } from "../CustomDataGrid";

// Combined types for GridColDef and GridRenderCellParams for linkedGenes and linkedICREs
export type colDef = CustomDataGridColDef<LinkedGeneInfo> | CustomDataGridColDef<LinkedICREInfo>;
type renderCellParams = GridRenderCellParams<LinkedGeneInfo> | GridRenderCellParams<LinkedICREInfo>;

export type TableDef = {
  name: string;
  data: LinkedGeneInfo[] | LinkedICREInfo[];
  columns: colDef[];
};

/**
 * Column definitions for the linked elements tab.
 */
export const geneNameCol: colDef = {
  field: "gene",
  headerName: "Common Gene Name",
  renderCell: (params: renderCellParams) => (
    <LinkComponent href={`/gene/${params.value}`} underline="hover">
      <i>{params.value}</i>
    </LinkComponent>
  ),
};

const GeneTypeFormatter = (value: string, row: LinkedGeneInfo) =>
  row.genetype
    ? row.genetype === "lncRNA"
      ? row.genetype
      : row.genetype
          .replaceAll("_", " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
    : value;

export const geneTypeCol: colDef = {
  field: "genetype",
  headerName: "Gene Type",
  valueGetter: (value, row: LinkedGeneInfo) => GeneTypeFormatter(value, row),
};

export const experimentCol: colDef = {
  field: "experiment_accession",
  headerName: "Experiment ID",
  renderCell: (params: renderCellParams) => (
    <LinkComponent
      href={`https://www.encodeproject.org/experiments/${params.value}`}
      openInNewTab
      showExternalIcon
      underline="hover"
    >
      {params.value}
    </LinkComponent>
  ),
};

export const displayNameCol: colDef = {
  field: "displayname",
  headerName: "Biosample",
};

export const scoreCol: colDef = {
  field: "score",
  headerName: "Score",
  type: "number",
};

export const pValCol: colDef = {
  field: "p_val",
  headerName: "P",
  type: "number",
  display: "flex",
  renderHeader: () => (
    <Typography variant="body2" pr={0.1}>
      <i>P</i>
    </Typography>
  ),
  renderCell: (params: renderCellParams) =>
    params.value === 0 ? "0" : toScientificNotationElement(params.value, 2, { variant: "body2" }),
};

export const assayCol: colDef = {
  field: "assay",
  headerName: "Assay Type",
};

export const gRNACol: colDef = {
  field: "grnaid",
  headerName: "gRNA ID",
};

export const effectSizeCol: colDef = {
  field: "effectsize",
  headerName: "Effect Size",
};

export const variantIDCol: colDef = {
  field: "variantid",
  headerName: "Variant ID",
};

export const sourceCol: colDef = {
  field: "source",
  headerName: "Source",
};

export const tissueCol: colDef = {
  field: "tissue",
  headerName: "Tissue",
};

export const slopeCol: colDef = {
  field: "slope",
  headerName: "Slope",
  type: "number",
};

export const accessionCol: colDef = {
  field: "accession",
  headerName: "Accession",
  renderCell: (params: renderCellParams) => {
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
};

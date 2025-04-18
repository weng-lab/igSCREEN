import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";
import { Typography } from "@mui/material";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { LinkComponent, toScientificNotationElement } from "common/utility";

// Combined types for GridColDef and GridRenderCellParams for linkedGenes and linkedICREs
export type colDef = GridColDef<LinkedGeneInfo> | GridColDef<LinkedICREInfo>;
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
  flex: 1,
  minWidth: 150,
  display: "flex",
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
  flex: 0.75,
  display: "flex",
  headerName: "Gene Type",
  valueGetter: (value, row: LinkedGeneInfo) => GeneTypeFormatter(value, row),
};

export const experimentCol: colDef = {
  field: "experiment_accession",
  flex: 1,
  minWidth: 150,
  display: "flex",
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
  flex: 3,
  display: "flex",
  headerName: "Biosample",
  renderCell: (params: renderCellParams) => (
    <Typography variant="body2" paddingBlock={1}>
      {params.value}
    </Typography>
  ),
};

export const scoreCol: colDef = {
  field: "score",
  flex: 0.5,
  display: "flex",
  headerName: "Score",
};

export const pValCol: colDef = {
  field: "p_val",
  flex: 0.75,
  display: "flex",
  headerName: "P",
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
  flex: 1,
  display: "flex",
  headerName: "Assay Type",
};

export const gRNACol: colDef = {
  field: "grnaid",
  flex: 1,
  minWidth: 200,
  display: "flex",
  headerName: "gRNA ID",
};

export const effectSizeCol: colDef = {
  field: "effectsize",
  flex: 0.75,
  display: "flex",
  headerName: "Effect Size",
};

export const variantIDCol: colDef = {
  field: "variantid",
  flex: 1.25,
  display: "flex",
  headerName: "Variant ID",
  renderCell: (params) => (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
      }}
    >
      {params.value}
    </div>
  ),
};

export const sourceCol: colDef = {
  field: "source",
  flex: 0.75,
  display: "flex",
  headerName: "Source",
};

export const tissueCol: colDef = {
  field: "tissue",
  flex: 2,
  display: "flex",
  headerName: "Tissue",
  renderCell: (params: renderCellParams) => (
    <Typography variant="body2" paddingBlock={1}>
      {params.value}
    </Typography>
  ),
};

export const slopeCol: colDef = {
  field: "slope",
  flex: 0.75,
  display: "flex",
  headerName: "Slope",
};

export const accessionCol: colDef = {
  field: "accession",
  flex: 1,
  display: "flex",
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

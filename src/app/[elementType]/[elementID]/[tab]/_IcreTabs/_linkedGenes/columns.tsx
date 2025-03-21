import { Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { CreateLink, GeneLink, toScientificNotationElement } from "./utils";

export const IntactHiCLoopsCols: GridColDef<LinkedGeneInfo>[] = [
  {
    field: "gene",
    flex: 1,
    display: "flex",
    headerName: "Common Gene Name",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
      <CreateLink
        linkPrefix={`http://localhost:3000/gene/`}
        linkArg={params.value}
        underline="hover"
        label={params.value}
      />
    ),
  },
  {
    field: "genetype",
    flex: 0.75,
    display: "flex",
    headerName: "Gene Type",
    valueGetter: (value, row: LinkedGeneInfo) =>
      row.genetype
        ? row.genetype === "lncRNA"
          ? row.genetype
          : row.genetype
              .replaceAll("_", " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
        : value,
  },
  {
    field: "experiment_accession",
    flex: 1,
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
  },
  {
    field: "displayname",
    flex: 3,
    display: "flex",
    headerName: "Biosample",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
      <Typography variant="body2" paddingBlock={1}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "score",
    flex: 0.5,
    display: "flex",
    headerName: "Score",
  },
  {
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
  },
];

export const ChIAPETCols: GridColDef<LinkedGeneInfo>[] = [
  {
    field: "gene",
    flex: 1,
    display: "flex",
    headerName: "Common Gene Name",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
      <GeneLink assembly={"grch38"} geneName={params.row.gene} />
    ),
  },
  {
    field: "genetype",
    flex: 1,
    display: "flex",
    headerName: "Gene Type",
    valueGetter: (value, row: LinkedGeneInfo) =>
      row.genetype
        ? row.genetype === "lncRNA"
          ? row.genetype
          : row.genetype
              .replaceAll("_", " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
        : value,
  },
  {
    field: "assay",
    flex: 1,
    display: "flex",
    headerName: "Assay Type",
  },
  {
    field: "experiment_accession",
    flex: 1,
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
  },
  {
    field: "displayname",
    flex: 1,
    display: "flex",
    headerName: "Biosample",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
      <Typography variant="body2" paddingBlock={1}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "score",
    flex: 1,
    display: "flex",
    headerName: "Score",
  },
];

export const CrisprFlowFISHCols: GridColDef<LinkedGeneInfo>[] = [
  {
    field: "gene",
    flex: 1,
    display: "flex",
    headerName: "Common Gene Name",
    // renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
    // ),
  },
  {
    field: "genetype",
    flex: 1,
    display: "flex",
    headerName: "Gene Type",
    valueGetter: (value, row: LinkedGeneInfo) =>
      row.genetype === "lncRNA"
        ? row.genetype
        : row.genetype
            .replaceAll("_", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
  },
  {
    field: "grnaid",
    flex: 1,
    display: "flex",
    headerName: "gRNA ID",
  },
  {
      field: "experiment_accession",
    flex: 1,
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
  },
  {
    field: "displayname",
    flex: 2.5,
    display: "flex",
    headerName: "Biosample",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
      <Typography variant="body2" paddingBlock={1}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "effectsize",
    flex: 0.75,
    display: "flex",
    headerName: "Effect Size",
  },
  {
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
  },
];

export const eQTLCols: GridColDef<LinkedGeneInfo>[] = [
  {
    field: "gene",
    flex: 1,
    display: "flex",
    headerName: "Common Gene Name",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
      <CreateLink
        linkPrefix={`http://localhost:3000/gene/`}
        linkArg={params.value}
        underline="hover"
        label={params.value}
      />
    ),
  },
  {
    field: "genetype",
    flex: 0.75,
    display: "flex",
    headerName: "Gene Type",
    valueGetter: (value, row: LinkedGeneInfo) =>
      row.genetype === "lncRNA"
        ? row.genetype
        : row.genetype
            .replaceAll("_", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
  },
  {
    field: "variantid",
    flex: 1.25,
    display: "flex",
    headerName: "Variant ID",
  },
  {
    field: "source",
    flex: 0.75,
    display: "flex",
    headerName: "Source",
  },
  {
    field: "tissue",
    flex: 2,
    display: "flex",
    headerName: "Tissue",
    renderCell: (params: GridRenderCellParams<LinkedGeneInfo>) => (
      <Typography variant="body2" paddingBlock={1}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "slope",
    flex: 0.75,
    display: "flex",
    headerName: "Slope",
  },
  {
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
  },
];

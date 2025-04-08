import {
  geneNameCol,
  geneTypeCol,
  experimentCol,
  displayNameCol,
  scoreCol,
  pValCol,
  gRNACol,
  effectSizeCol,
  tissueCol,
  sourceCol,
  variantIDCol,
  slopeCol,
  assayCol,
  colDef,
} from "common/components/linkedElements/columns";

/**
 * Table definitions for the linked genes tab.
 */
export const IntactHiCLoopsCols: colDef[] = [
  geneNameCol,
  geneTypeCol,
  experimentCol,
  displayNameCol,
  scoreCol,
  pValCol,
];

export const ChIAPETCols: colDef[] = [
  geneNameCol,
  geneTypeCol,
  assayCol,
  experimentCol,
  displayNameCol,
  scoreCol,
];

export const CrisprFlowFISHCols: colDef[] = [
  geneNameCol,
  { ...geneTypeCol, flex: 1 },
  gRNACol,
  { ...experimentCol, flex: 1.25 },
  displayNameCol,
  effectSizeCol,
  pValCol,
];

export const eQTLCols: colDef[] = [
  geneNameCol,
  geneTypeCol,
  variantIDCol,
  sourceCol,
  tissueCol,
  slopeCol,
  pValCol,
];

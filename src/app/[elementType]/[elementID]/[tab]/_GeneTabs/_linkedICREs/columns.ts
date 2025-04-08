import { GridColDef } from "@mui/x-data-grid";
import { accessionCol } from "../../_IcreTabs/_linkedGenes/columns";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";

export const RNAPIIChIAPETCols: GridColDef<LinkedICREInfo>[] = [
  accessionCol,
];
  
export const CTCFChIAPETCols: GridColDef<LinkedICREInfo>[] = [
  accessionCol,
];

export const HiCCols: GridColDef<LinkedICREInfo>[] = [
  accessionCol,
];  

export const CrisprFlowFISHCols: GridColDef<LinkedICREInfo>[] = [
  accessionCol,
];  


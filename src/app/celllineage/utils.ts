import { cellTypeStaticInfo } from "../../common/consts";
import { CellDisplayName, CellLineageTreeState, CellName, CellQueryValue, CellTypeStaticInfo } from "./types";


/**
 * 
 * @todo these functions should be moved out of the celllineage directory and into common probably
 * @deprecated
 */
export const getCellColor = (cell: CellName | CellQueryValue | CellDisplayName): string => {
  return Object.values(cellTypeStaticInfo).find((x: CellTypeStaticInfo) => x.id === cell || x.displayName === cell || extractQueryValues(x, "B").includes(cell as CellQueryValue))?.color ?? "#000000"
}

/**
 * 
 * @param cell 
 * @param appendStim 
 * @param appendStudy IMPORTANT - only works if you're passing CellQueryValue, which have the -S or -U on the end. Otherwise will mark all as Corces
 * @returns 
 */
export const getCellDisplayName = (cell: CellName | CellQueryValue, appendStim = false, appendStudy = false): string => {
  let name = Object.values(cellTypeStaticInfo).find((x: CellTypeStaticInfo) => x.id === cell || extractQueryValues(x, "B").includes(cell as CellQueryValue))?.displayName ?? cell
  if (name === cell) console.error("Unable to find display name for " + cell)
  if (appendStim && cell.slice(-2) === "-S") name += " (stimulated)"
  if (appendStudy && (cell.slice(-2) === "-S" || cell.slice(-2) === "-U")){
     name += " - Study: Calderon"
  } else if (appendStudy) name += " - Study: Corces"
  return name
}

/**
 * 
 * @param cell CellTypeInfo
 * @param want "S" | "U" | "B" The query value(s) wanted
 * @returns array of query values
 */
export const extractQueryValues = (cell: CellTypeStaticInfo, want: "S" | "U" | "B"): (CellQueryValue[]) => {
  switch (want) {
    case "U": return cell.queryValues?.unstimulated ? [...Object.values(cell.queryValues.unstimulated).flat()] : []
    case "S": return cell.queryValues?.stimulated ? [...Object.values(cell.queryValues.stimulated).flat()] : []
    case "B": return (cell.queryValues?.unstimulated ? Object.values(cell.queryValues.unstimulated).flat() : []).concat(cell.queryValues?.stimulated ? (Object.values(cell.queryValues.stimulated).flat()) : [])
  }
}

const cellNames: CellName[] = [
  "Myeloid_DCs",
  "pDCs",
  "Naive_B",
  "Mem_B",
  "Plasmablasts",
  "Regulatory_T",
  "Naive_Tregs",
  "Memory_Tregs",
  "Effector_CD4pos_T",
  "Naive_Teffs",
  "Memory_Teffs",
  "Th1_precursors",
  "Th2_precursors",
  "Th17_precursors",
  "Follicular_T_Helper",
  "Naive_CD8_T",
  "Central_memory_CD8pos_T",
  "Effector_memory_CD8pos_T",
  "Gamma_delta_T",
  "Immature_NK",
  "Mature_NK",
  "Memory_NK",
  "HSC",
  "MPP",
  "CMP",
  "MEP",
  "Ery",
  "GMP",
  "LMPP",
  "CLP",
  "CD4Tcell",
  "NKcell",
  "Monocytes",
  "Bulk_B",
  "CD8pos_T"
]

/**
 * Initial Selected Cells being query values not cell names is convenient right now, but confusing. Consider changing in future to plain names, like {name: cellName, stim: "B" | "U" | "S"}
 * @param initialSelectedCells cells to select initially, needs to match query values like Bulk_B-U (NOT CELL NAMES).
 * @param interactive disables interacting with nodes
 */
export const generateCellLineageTreeState = (initialSelectedCells: CellQueryValue[], interactive: boolean): CellLineageTreeState => {
  //Some iCREs are active in celltypes (Ex: Blast) that are not in the tree. Need to handle this case. Ex: EH38E0243977 is active in Blast
  let cellLineageTreeState = {} as CellLineageTreeState

  for (const cellName of cellNames) {
    //Try to find matches in the query values of cellLineageTreeStaticInfo
    const unstimSelected = initialSelectedCells.some(cell => extractQueryValues(cellTypeStaticInfo[cellName], "U").includes(cell))
    const stimSelected = initialSelectedCells.some(cell => extractQueryValues(cellTypeStaticInfo[cellName], "S").includes(cell))
    cellLineageTreeState[cellName] = {
      selected: unstimSelected || stimSelected,
      selectable: interactive,
      stimulated:
        (unstimSelected && stimSelected) ? "B" :
        (unstimSelected && !stimSelected) ? "U" :
        (!unstimSelected && stimSelected) ? "S" :
        "U"
    }
  }

  return cellLineageTreeState
}

const svgData = (_svg): string => {
  let svg = _svg.cloneNode(true);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  let preface = '<?xml version="1.0" standalone="no"?>';
  return preface + svg.outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
};

const downloadData = (text: string, filename: string, type: string = 'text/plain') => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadSVG = (ref: React.MutableRefObject<SVGSVGElement>, filename: string) => {
  ref.current && downloadData(svgData(ref.current!), filename, 'image/svg;charset=utf-8');
}

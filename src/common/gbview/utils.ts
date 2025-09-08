export function randomColor() {
  const colors = [
    "#4a90e2", // medium blue
    "#e84d3d", // dark red
    "#27ae60", // forest green
    "#8e44ad", // purple
    "#d35400", // burnt orange
    "#16a085", // teal
    "#c0392b", // brick red
    "#2980b9", // darker blue
    "#f39c12", // golden brown
    "#2c3e50", // navy blue
    "#7f8c8d", // slate gray
    "#8b4513", // saddle brown
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function trackColor(lineage: string) {
  switch (lineage) {
    case "Bcells":
      return "#0000ff";
    case "CD4_Tcells":
      return "#980000";
    case "CD8_Tcells":
      return "#ff9900";
    case "Bulk_Tcells":
      return "#ff0000";
    case "gd_Tcells":
      return "#fa0056";
    case "NK":
      return "#38761d";
    case "Myeloid":
      return "#9900ff";
    case "Progenitors":
      return "#666666";
    case "Leukemia":
      return "#25e6c9";
    case "Erythroblasts":
      return "#684fda";
  }
}

export function assayColor(assay: string) {
  switch (assay) {
    case "DNase":
      return "#06DA93";
    case "ATAC":
      return "#02c7b9";
    case "RNA":
      return "#00aa00";
  }
  return "#000000";
}

export function lineageName(lineage: string) {
  switch (lineage) {
    case "Bcells":
      return "B cells";
    case "CD4_Tcells":
      return "CD4+ T cells";
    case "CD8_Tcells":
      return "CD8+ T cells";
    case "Bulk_Tcells":
      return "Bulk T cells";
    case "gd_Tcells":
      return "gd_T cells";
    case "NK":
      return "NK cells";
    case "Myeloid":
      return "Myeloid cells";
    case "Progenitors":
      return "Progenitors";
    case "Leukemia":
      return "Leukemia";
    case "Erythroblasts":
      return "Erythroblasts";
  }
}

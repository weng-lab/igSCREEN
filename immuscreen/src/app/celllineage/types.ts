export type CellName =
  "Myeloid_DCs"
  | "pDCs"
  | "Naive_B"
  | "Mem_B"
  | "Plasmablasts"
  | "Regulatory_T"
  | "Naive_Tregs"
  | "Memory_Tregs"
  | "Effector_CD4pos_T"
  | "Naive_Teffs"
  | "Memory_Teffs"
  | "Th1_precursors"
  | "Th2_precursors"
  | "Th17_precursors"
  | "Follicular_T_Helper"
  | "Naive_CD8_T"
  | "Central_memory_CD8pos_T"
  | "Effector_memory_CD8pos_T"
  | "Gamma_delta_T"
  | "Immature_NK"
  | "Mature_NK"
  | "Memory_NK"
  | "HSC"
  | "MPP"
  | "CMP"
  | "MEP"
  | "Ery"
  | "GMP"
  | "LMPP"
  | "CLP"
  | "CD4Tcell"
  | "NKcell"
  | "Monocytes"
  | "Bulk_B"
  | "CD8pos_T"
  | "pHSC"
  | "LSC"
  | "Blast"

export type CellDisplayName =
  "Monocyte"
  | "Myeloid dendritic cell"
  | "Plasmacytoid dendritic cell"
  | "Bulk B cell"
  | "Naïve B cell"
  | "Memory B cell"
  | "Plasmablast"
  | "Regulatory CD4+ T cell"
  | "Naïve T regulatory cell"
  | "Memory T regulatory cell"
  | "Effector CD4+ T cell"
  | "Naïve T effector cell"
  | "Memory T effector cell"
  | "Th1 precursor"
  | "Th2 precursor"
  | "Th17 precursor"
  | "T follicular helper cell"
  | "CD8+ T cell"
  | "Naïve CD8+ T cell"
  | "Central memory CD8+ T cell"
  | "Effector memory CD8+ T cell"
  | "Gamma-delta T cell"
  | "Immature NK cell"
  | "Mature NK cell"
  | "Memory NK cell"
  | "Hematopoetic stem cell"
  | "Multipotent progenitor"
  | "Common myeloid progenitor"
  | "Megakaryocyte-erythroid progenitor"
  | "Erythrocyte"
  | "Granulocyte-monocyte progenitors"
  | "Lymphocyte-primed multipotent progenitor"
  | "Common lymphoid progenitor"
  | "CD4+ T cell"
  | "NK cell"
  | "Preleukemic Hematopoetic Stem Cells"
  | "Leukemia Stem Cells"
  | "Leukemic Blast Cells";

export type CellQueryValue =
  "Myeloid_DCs-U"
  | "pDCs-U"
  | "Naive_B-U"
  | "Naive_B-S"
  | "Mem_B-U"
  | "Mem_B-S"
  | "Plasmablasts-U"
  | "Regulatory_T-U"
  | "Regulatory_T-S"
  | "Naive_Tregs-U"
  | "Naive_Tregs-S"
  | "Memory_Tregs-U"
  | "Memory_Tregs-S"
  | "Effector_CD4pos_T-U"
  | "Effector_CD4pos_T-S"
  | "Naive_Teffs-U"
  | "Naive_Teffs-S"
  | "Memory_Teffs-U"
  | "Memory_Teffs-S"
  | "Th1_precursors-U"
  | "Th1_precursors-S"
  | "Th2_precursors-U"
  | "Th2_precursors-S"
  | "Th17_precursors-U"
  | "Th17_precursors-S"
  | "Follicular_T_Helper-U"
  | "Follicular_T_Helper-S"
  | "Naive_CD8_T-U"
  | "Naive_CD8_T-S"
  | "Central_memory_CD8pos_T-U"
  | "Central_memory_CD8pos_T-S"
  | "Effector_memory_CD8pos_T-U"
  | "Effector_memory_CD8pos_T-S"
  | "Gamma_delta_T-U"
  | "Gamma_delta_T-S"
  | "Immature_NK-U"
  | "Mature_NK-U"
  | "Mature_NK-S"
  | "Memory_NK-U"
  | "HSC"
  | "CD34_Cord_Blood"
  | "CD34_Bone_Marrow"
  | "MPP"
  | "CMP"
  | "MEP"
  | "Ery"
  | "GMP"
  | "LMPP"
  | "CLP"
  | "CD4Tcell"
  | "NKcell"
  | "Monocytes-U"
  | "Mono"
  | "Monocytes-S"
  | "Bulk_B-U"
  | "Bcell"
  | "Bulk_B-S"
  | "CD8pos_T-U"
  | "CD8Tcell"
  | "CD8pos_T-S"
  | "pHSC"
  | "LSC"
  | "Blast"

// Static information for each cell
export type CellTypeStaticInfo = {
  readonly id: CellName;
  readonly displayName: CellDisplayName;
  /**
   * Display name used in the Cell Lineage Tree. Insert '/' to break name onto multiple lines
   */
  readonly treeDisplayName: string;
  readonly unstimImagePath: string;
  readonly stimImagePath?: string;
  readonly unstimCount: number
  readonly stimCount?: number
  readonly stimulable: boolean;
  readonly queryValues?: {
    readonly unstimulated: { Calderon?: CellQueryValue | CellQueryValue[], Corces?: CellQueryValue | CellQueryValue[] };
    readonly stimulated?: { Calderon: CellQueryValue | CellQueryValue[] }
  }
  readonly color: string;
}

// Dynamic information that changes depending on use case
export type DynamicCellTypeInfo = {
  selected: boolean;
  stimulated: "S" | "U" | "B";
  readonly selectable: boolean;
}

export type CellLineageTreeState = { [key in CellName]: DynamicCellTypeInfo }
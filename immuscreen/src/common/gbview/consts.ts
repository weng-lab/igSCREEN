

export const CalderonCellTypes = [
["Monocytes-U",	"Monocyte"],
["Monocytes-S",	"Monocyte (stimulated)"],
["Myeloid_DCs-U",	"Myeloid dendritic cells"],
["pDCs-U",	"Plasmacytoid dendritic cells"],
["Bulk_B-U",	"Bulk B cells"],
["Bulk_B-S",	"Bulk B cells (stimulated)"],
["Naive_B-U",	"Naïve B cells"],
["Naive_B-S",	"Naïve B cells (stimulated)"],
["Mem_B-U",	"Memory B cells"],
["Mem_B-S",	"Memory B cells (stimulated)"],
["Plasmablasts-U",	"Plasmablasts"],
["Regulatory_T-U",	"Regulatory CD4+ T cells"],
["Regulatory_T-S",	"Regulatory CD4+ T cells (stimulated)"],
["Naive_Tregs-U",	"Naïve T regulatory cell"],
["Naive_Tregs-S",	"Naïve T regulatory cell (stimulated)"],
["Memory_Tregs-U",	"Memory T regulatory cell"],
["Memory_Tregs-S",	"Memory T regulatory cell (stimulated)"],
["Effector_CD4pos_T-U",	"Effector CD4 T cell"],
["Effector_CD4pos_T-S",	"Effector CD4 T cell (stimulated)"],
["Naive_Teffs-U",	"Naïve T effector cells"],
["Naive_Teffs-S",	"Naïve T effector cells (stimulated)"],
["Memory_Teffs-U",	"Memory T effector cells"],
["Memory_Teffs-S",	"Memory T effector cells (stimulated)"],
["Th1_precursors-U",	"T helper 1 cell precursors"],
["Th1_precursors-S",	"T helper 1 cell precursors (stimulated)"],
["Th2_precursors-U",	"T helper 2 cell precursors"],
["Th2_precursors-S",	"T helper 2 cell precursors (stimulated)"],
["Th17_precursors-U",	"T helper 17 precursors"],
["Th17_precursors-S",	"T helper 17 precursors (stimulated)"],
["Follicular_T_Helper-U",	"T follicular helper cells"],
["Follicular_T_Helper-S",	"T follicular helper cells (stimulated)"],
["CD8pos_T-U",	"CD8+ T cells"],
["CD8pos_T-S",	"CD8+ T cells (stimulated)"],
["Naive_CD8_T-U",	"Naïve CD8+ T cells"],
["Naive_CD8_T-S",	"Naïve CD8+ T cells (stimulated)"],
["Central_memory_CD8pos_T-U",	"Central memory CD8+ T cells"],
["Central_memory_CD8pos_T-S",	"Central memory CD8+ T cells (stimulated)"],
["Effector_memory_CD8pos_T-U",	"Effector memory CD8+ T cells"],
["Effector_memory_CD8pos_T-S",	"Effector memory CD8+ T cells (stimulated)"],
["Gamma_delta_T-U",	"Gamma delta T cells"],
["Gamma_delta_T-S",	"Gamma delta T cells (stimulated)"],
["Immature_NK-U",	"Immature Natural Killer cells"],
["Mature_NK-U",	"Mature Natural Killer cells"],
["Mature_NK-S",	"Mature Natural Killer cells (stimulated)"],
["Memory_NK-U",	"Memory Natural Killer cells"]
]

export const BulkAtacCelltypeTrack = [ "Bulk_B-S","Bulk_B-U","CD8pos_T-S","CD8pos_T-U","Central_memory_CD8pos_T-S","Central_memory_CD8pos_T-U","Effector_CD4pos_T-S", "Effector_CD4pos_T-U","Effector_memory_CD8pos_T-S",
  "Effector_memory_CD8pos_T-U","Follicular_T_Helper-S","Follicular_T_Helper-U","Gamma_delta_T-S","Gamma_delta_T-U","Immature_NK-U","Mature_NK-U", "Mem_B-S","Mem_B-U","Memory_Teffs-S", "Memory_Teffs-U","Memory_Tregs-S","Memory_Tregs-U",
    "Monocytes-U","Myeloid_DCs-U","Naive_B-S","Naive_B-U","Naive_CD8_T-S","Naive_CD8_T-U","Naive_Teffs-S","Naive_Teffs-U","Naive_Tregs-S","Naive_Tregs-U","pDCs-U","Plasmablasts-U",
    "Regulatory_T-S","Regulatory_T-U","Th17_precursors-S","Th17_precursors-U","Th1_precursors-S","Th1_precursors-U","Th2_precursors-S","Th2_precursors-U"]

export const CalderonBigWigTracks = [
["1001-Monocytes-U","Monocyte","Monocytes in donor 1001","Myeloid"],
["1003-Monocytes-U","Monocyte","Monocytes in donor 1002","Myeloid"],
["1004-Monocytes-U","Monocyte ","Monocytes in donor 1003","Myeloid"],
["1001-Monocytes-S","Monocyte (stimulated)","Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1001","Myeloid"],
["1002-Monocytes-S","Monocyte (stimulated)","Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1002","Myeloid"],
["1003-Monocytes-S","Monocyte (stimulated)","Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1003","Myeloid"],
["1004-Monocytes-S","Monocyte (stimulated)","Monocytes, stimulated with 100 ng/ml LPS for 6 hours, in donor 1004","Myeloid"],
["1008-Monocytes-S","Monocyte (stimulated)","Monocytes, stimulated with 1 µg/ml LPS for 24 hours, in donor 1008","Myeloid"],
["1010-Monocytes-S","Monocyte (stimulated)","Monocytes, stimulated with 1 µg/ml LPS for 24 hours, in donor 1010","Myeloid"],
["1001-Myeloid_DCs-U","Myeloid dendritic cells","Myeloid Dendritic cells in donor 1001","Myeloid"],
["1002-Myeloid_DCs-U","Myeloid dendritic cells","Myeloid Dendritic cells in donor 1002","Myeloid"],
["1008-Myeloid_DCs-U","Myeloid dendritic cells","Myeloid Dendritic cells in donor 1008","Myeloid"],
["1001-pDCs-U","Plasmacytoid dendritic cells","Plasmacytoid dendritic cells in donor 1001","Myeloid"],
["1002-pDCs-U","Plasmacytoid dendritic cells","Plasmacytoid dendritic cells in donor 1002","Myeloid"],
["1008-pDCs-U","Plasmacytoid dendritic cells","Plasmacytoid dendritic cells in donor 1008","Myeloid"],
["1001-Bulk_B-U","Bulk B cells","Bulk B cells in donor 1001","Lymphoid"],
["1002-Bulk_B-U","Bulk B cells","Bulk B cells in donor 1002","Lymphoid"],
["1003-Bulk_B-U","Bulk B cells","Bulk B cells in donor 1003","Lymphoid"],
["1004-Bulk_B-U","Bulk B cells","Bulk B cells in donor 1004","Lymphoid"],
["1001-Bulk_B-S","Bulk B cells (stimulated)","Bulk B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1001","Lymphoid"],
["1002-Bulk_B-S","Bulk B cells (stimulated)","Bulk B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1002","Lymphoid"],
["1003-Bulk_B-S","Bulk B cells (stimulated)","Bulk B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1003","Lymphoid"],
["1001-Naive_B-U","Naïve B cells","Naïve B cells in donor 1001","Lymphoid"],
["1002-Naive_B-U","Naïve B cells","Naïve B cells in donor 1002","Lymphoid"],
["1003-Naive_B-U","Naïve B cells","Naïve B cells in donor 1003","Lymphoid"],
["1004-Naive_B-U","Naïve B cells","Naïve B cells in donor 1004","Lymphoid"],
["1001-Naive_B-S","Naïve B cells (stimulated)","Naïve B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1001","Lymphoid"],
["1002-Naive_B-S","Naïve B cells (stimulated)","Naïve B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1002","Lymphoid"],
["1003-Naive_B-S","Naïve B cells (stimulated)","Naïve B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1003","Lymphoid"],
["1001-Mem_B-U","Memory B cells","Memory B cells in donor 1001","Lymphoid"],
["1002-Mem_B-U","Memory B cells","Memory B cells in donor 1002","Lymphoid"],
["1003-Mem_B-U","Memory B cells","Memory B cells in donor 1003","Lymphoid"],
["1004-Mem_B-U","Memory B cells","Memory B cells in donor 1004","Lymphoid"],
["1001-Mem_B-S","Memory B cells (stimulated)","Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1001","Lymphoid"],
["1002-Mem_B-S","Memory B cells (stimulated)","Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1002","Lymphoid"],
["1003-Mem_B-S","Memory B cells (stimulated)","Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1003","Lymphoid"],
["1010-Mem_B-S","Memory B cells (stimulated)","Memory B cells, stimulated with 10µg/ml anti-IgG/IgM antibodies and 20 ng/ml IL-4 for 24 hours, in donor 1010","Lymphoid"],
["1001-Plasmablasts-U","Plasmablasts","Plasmablasts in donor 1001","Lymphoid"],
["1002-Plasmablasts-U","Plasmablasts","Plasmablasts in donor 1002","Lymphoid"],
["1010-Plasmablasts-U","Plasmablasts","Plasmablasts in donor 1010","Lymphoid"],
["1001-Regulatory_T-U","Regulatory CD4+ T cells","Regulatory CD4+ T cells in donor 1001","Lymphoid"],
["1002-Regulatory_T-U","Regulatory CD4+ T cells","Regulatory CD4+ T cells in donor 1002","Lymphoid"],
["1003-Regulatory_T-U","Regulatory CD4+ T cells","Regulatory CD4+ T cells in donor 1003","Lymphoid"],
["1004-Regulatory_T-U","Regulatory CD4+ T cells","Regulatory CD4+ T cells in donor 1004","Lymphoid"],
["1001-Regulatory_T-S","Regulatory CD4+ T cells (stimulated)","Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Regulatory_T-S","Regulatory CD4+ T cells (stimulated)","Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Regulatory_T-S","Regulatory CD4+ T cells (stimulated)","Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Regulatory_T-S","Regulatory CD4+ T cells (stimulated)","Regulatory CD4+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1004-Naive_Tregs-U","Naïve T regulatory cell","Naïve T regulatory cells in donor 1004","Lymphoid"],
["1008-Naive_Tregs-U","Naïve T regulatory cell","Naïve T regulatory cells in donor 1008","Lymphoid"],
["1004-Naive_Tregs-S","Naïve T regulatory cell (stimulated)","Naïve T regulatory cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1010-Naive_Tregs-S","Naïve T regulatory cell (stimulated)","Naïve T regulatory cells, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1010","Lymphoid"],
["1001-Memory_Tregs-U","Memory T regulatory cell","Memory T regulatory cell in donor 1001","Lymphoid"],
["1002-Memory_Tregs-U","Memory T regulatory cell","Memory T regulatory cell in donor 1002","Lymphoid"],
["1003-Memory_Tregs-U","Memory T regulatory cell","Memory T regulatory cell in donor 1003","Lymphoid"],
["1004-Memory_Tregs-U","Memory T regulatory cell","Memory T regulatory cell in donor 1004","Lymphoid"],
["1001-Memory_Tregs-S","Memory T regulatory cell (stimulated)","Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Memory_Tregs-S","Memory T regulatory cell (stimulated)","Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Memory_Tregs-S","Memory T regulatory cell (stimulated)","Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Memory_Tregs-S","Memory T regulatory cell (stimulated)","Memory T regulatory cell, stimulated with 1:1 CD3/CD28 coated beads and 300 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Effector_CD4pos_T-U","Effector CD4 T cell","Effector CD4 T cell in donor 1001","Lymphoid"],
["1002-Effector_CD4pos_T-U","Effector CD4 T cell","Effector CD4 T cell in donor 1002","Lymphoid"],
["1003-Effector_CD4pos_T-U","Effector CD4 T cell","Effector CD4 T cell in donor 1003","Lymphoid"],
["1004-Effector_CD4pos_T-U","Effector CD4 T cell","Effector CD4 T cell in donor 1004","Lymphoid"],
["1001-Effector_CD4pos_T-S","Effector CD4 T cell (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Effector_CD4pos_T-S","Effector CD4 T cell (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Effector_CD4pos_T-S","Effector CD4 T cell (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1001-Naive_Teffs-U","Naïve T effector cells","Naïve T effector cells in donor 1001","Lymphoid"],
["1002-Naive_Teffs-U","Naïve T effector cells","Naïve T effector cells in donor 1002","Lymphoid"],
["1003-Naive_Teffs-U","Naïve T effector cells","Naïve T effector cells in donor 1003","Lymphoid"],
["1004-Naive_Teffs-U","Naïve T effector cells","Naïve T effector cells in donor 1004","Lymphoid"],
["1001-Naive_Teffs-S","Naïve T effector cells (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Naive_Teffs-S","Naïve T effector cells (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Naive_Teffs-S","Naïve T effector cells (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Naive_Teffs-S","Naïve T effector cells (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1011-Naive_Teffs-S","Naïve T effector cells (stimulated)","Effector CD4 T cell, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1011","Lymphoid"],
["1001-Memory_Teffs-U","Memory T effector cells","Memory T effector cells in donor 1001","Lymphoid"],
["1002-Memory_Teffs-U","Memory T effector cells","Memory T effector cells in donor 1002","Lymphoid"],
["1003-Memory_Teffs-U","Memory T effector cells","Memory T effector cells in donor 1003","Lymphoid"],
["1004-Memory_Teffs-U","Memory T effector cells","Memory T effector cells in donor 1004","Lymphoid"],
["1001-Memory_Teffs-S","Memory T effector cells (stimulated)","Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Memory_Teffs-S","Memory T effector cells (stimulated)","Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Memory_Teffs-S","Memory T effector cells (stimulated)","Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Memory_Teffs-S","Memory T effector cells (stimulated)","Memory T effector cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Th1_precursors-U","T helper 1 cell precursors","T helper 1 cell precursors in donor 1001","Lymphoid"],
["1002-Th1_precursors-U","T helper 1 cell precursors","T helper 1 cell precursors in donor 1002","Lymphoid"],
["1003-Th1_precursors-U","T helper 1 cell precursors","T helper 1 cell precursors in donor 1003","Lymphoid"],
["1004-Th1_precursors-U","T helper 1 cell precursors","T helper 1 cell precursors in donor 1004","Lymphoid"],
["1001-Th1_precursors-S","T helper 1 cell precursors (stimulated)","T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Th1_precursors-S","T helper 1 cell precursors (stimulated)","T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Th1_precursors-S","T helper 1 cell precursors (stimulated)","T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Th1_precursors-S","T helper 1 cell precursors (stimulated)","T helper 1 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Th2_precursors-U","T helper 2 cell precursors","T helper 2 cell precursors in donor 1001","Lymphoid"],
["1002-Th2_precursors-U","T helper 2 cell precursors","T helper 2 cell precursors in donor 1002","Lymphoid"],
["1003-Th2_precursors-U","T helper 2 cell precursors","T helper 2 cell precursors in donor 1003","Lymphoid"],
["1004-Th2_precursors-U","T helper 2 cell precursors","T helper 2 cell precursors in donor 1004","Lymphoid"],
["1001-Th2_precursors-S","T helper 2 cell precursors (stimulated)","T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Th2_precursors-S","T helper 2 cell precursors (stimulated)","T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Th2_precursors-S","T helper 2 cell precursors (stimulated)","T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Th2_precursors-S","T helper 2 cell precursors (stimulated)","T helper 2 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Th17_precursors-U","T helper 17 cell precursors","T helper 17 cell precursors in donor 1001","Lymphoid"],
["1002-Th17_precursors-U","T helper 17 cell precursors","T helper 17 cell precursors in donor 1002","Lymphoid"],
["1004-Th17_precursors-U","T helper 17 cell precursors","T helper 17 cell precursors in donor 1004","Lymphoid"],
["1001-Th17_precursors-S","T helper 17 cell precursors (stimulated)","T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Th17_precursors-S","T helper 17 cell precursors (stimulated)","T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Th17_precursors-S","T helper 17 cell precursors (stimulated)","T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Th17_precursors-S","T helper 17 cell precursors (stimulated)","T helper 17 cell precursors, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Follicular_T_Helper-U","T follicular helper cells","T follicular helper cells in donor 1001","Lymphoid"],
["1002-Follicular_T_Helper-U","T follicular helper cells","T follicular helper cells in donor 1002","Lymphoid"],
["1003-Follicular_T_Helper-U","T follicular helper cells","T follicular helper cells in donor 1003","Lymphoid"],
["1004-Follicular_T_Helper-U","T follicular helper cells","T follicular helper cells in donor 1004","Lymphoid"],
["1010-Follicular_T_Helper-U","T follicular helper cells","T follicular helper cells in donor 1010","Lymphoid"],
["1001-Follicular_T_Helper-S","T follicular helper cells (stimulated)","T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Follicular_T_Helper-S","T follicular helper cells (stimulated)","T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Follicular_T_Helper-S","T follicular helper cells (stimulated)","T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Follicular_T_Helper-S","T follicular helper cells (stimulated)","T follicular helper cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-CD8pos_T-U","CD8+ T cells","CD8+ T cells in donor 1001","Lymphoid"],
["1002-CD8pos_T-U","CD8+ T cells","CD8+ T cells in donor 1002","Lymphoid"],
["1003-CD8pos_T-U","CD8+ T cells","CD8+ T cells in donor 1003","Lymphoid"],
["1004-CD8pos_T-U","CD8+ T cells","CD8+ T cells in donor 1004","Lymphoid"],
["1001-CD8pos_T-S","CD8+ T cells (stimulated)","CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-CD8pos_T-S","CD8+ T cells (stimulated)","CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-CD8pos_T-S","CD8+ T cells (stimulated)","CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1001-Naive_CD8_T-U","Naïve CD8+ T cells","Naïve CD8+ T cells in donor 1001","Lymphoid"],
["1002-Naive_CD8_T-U","Naïve CD8+ T cells","Naïve CD8+ T cells in donor 1002","Lymphoid"],
["1003-Naive_CD8_T-U","Naïve CD8+ T cells","Naïve CD8+ T cells in donor 1003","Lymphoid"],
["1004-Naive_CD8_T-U","Naïve CD8+ T cells","Naïve CD8+ T cells in donor 1004","Lymphoid"],
["1001-Naive_CD8_T-S","Naïve CD8+ T cells (stimulated)","Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Naive_CD8_T-S","Naïve CD8+ T cells (stimulated)","Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Naive_CD8_T-S","Naïve CD8+ T cells (stimulated)","Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Naive_CD8_T-S","Naïve CD8+ T cells (stimulated)","Naïve CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Central_memory_CD8pos_T-U","Central memory CD8+ T cells","Central memory CD8+ T cells in donor 1001","Lymphoid"],
["1002-Central_memory_CD8pos_T-U","Central memory CD8+ T cells","Central memory CD8+ T cells in donor 1002","Lymphoid"],
["1003-Central_memory_CD8pos_T-U","Central memory CD8+ T cells","Central memory CD8+ T cells in donor 1003","Lymphoid"],
["1004-Central_memory_CD8pos_T-U","Central memory CD8+ T cells","Central memory CD8+ T cells in donor 1004","Lymphoid"],
["1001-Central_memory_CD8pos_T-S","Central memory CD8+ T cells (stimulated)","Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Central_memory_CD8pos_T-S","Central memory CD8+ T cells (stimulated)","Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Central_memory_CD8pos_T-S","Central memory CD8+ T cells (stimulated)","Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Central_memory_CD8pos_T-S","Central memory CD8+ T cells (stimulated)","Central memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Effector_memory_CD8pos_T-U","Effector memory CD8+ T cells","Effector memory CD8+ T cells in donor 1001","Lymphoid"],
["1002-Effector_memory_CD8pos_T-U","Effector memory CD8+ T cells","Effector memory CD8+ T cells in donor 1002","Lymphoid"],
["1003-Effector_memory_CD8pos_T-U","Effector memory CD8+ T cells","Effector memory CD8+ T cells in donor 1003","Lymphoid"],
["1004-Effector_memory_CD8pos_T-U","Effector memory CD8+ T cells","Effector memory CD8+ T cells in donor 1004","Lymphoid"],
["1001-Effector_memory_CD8pos_T-S","Effector memory CD8+ T cells (stimulated)","Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1001","Lymphoid"],
["1002-Effector_memory_CD8pos_T-S","Effector memory CD8+ T cells (stimulated)","Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Effector_memory_CD8pos_T-S","Effector memory CD8+ T cells (stimulated)","Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Effector_memory_CD8pos_T-S","Effector memory CD8+ T cells (stimulated)","Effector memory CD8+ T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Gamma_delta_T-U","Gamma delta T cells","Gamma delta T cells in donor 1001","Lymphoid"],
["1002-Gamma_delta_T-U","Gamma delta T cells","Gamma delta T cells in donor 1002","Lymphoid"],
["1003-Gamma_delta_T-U","Gamma delta T cells","Gamma delta T cells in donor 1003","Lymphoid"],
["1004-Gamma_delta_T-U","Gamma delta T cells","Gamma delta T cells in donor 1004","Lymphoid"],
["1002-Gamma_delta_T-S","Gamma delta T cells (stimulated)","Gamma delta T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1002","Lymphoid"],
["1003-Gamma_delta_T-S","Gamma delta T cells (stimulated)","Gamma delta T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1003","Lymphoid"],
["1004-Gamma_delta_T-S","Gamma delta T cells (stimulated)","Gamma delta T cells, stimulated with 1:1 CD3/CD28 coated beads and 50 U/ml IL-2 for 24 hours, in donor 1004","Lymphoid"],
["1001-Immature_NK-U","Immature Natural Killer cells","Immature Natural Killer cells in donor 1001","Lymphoid"],
["1002-Immature_NK-U","Immature Natural Killer cells","Immature Natural Killer cells in donor 1002","Lymphoid"],
["1003-Immature_NK-U","Immature Natural Killer cells","Immature Natural Killer cells in donor 1003","Lymphoid"],
["1004-Immature_NK-U","Immature Natural Killer cells","Immature Natural Killer cells in donor 1004","Lymphoid"],
["1008-Immature_NK-U","Immature Natural Killer cells","Immature Natural Killer cells in donor 1008","Lymphoid"],
["1001-Mature_NK-U","Mature Natural Killer cells","Mature Natural Killer cells in donor 1001","Lymphoid"],
["1003-Mature_NK-U","Mature Natural Killer cells","Mature Natural Killer cells in donor 1003","Lymphoid"],
["1004-Mature_NK-U","Mature Natural Killer cells","Mature Natural Killer cells in donor 1004","Lymphoid"],
["1008-Mature_NK-U","Mature Natural Killer cells","Mature Natural Killer cells in donor 1008","Lymphoid"],
["1001-Mature_NK-S","Mature Natural Killer cells (stimulated)","Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1001","Lymphoid"],
["1002-Mature_NK-S","Mature Natural Killer cells (stimulated)","Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1002","Lymphoid"],
["1003-Mature_NK-S","Mature Natural Killer cells (stimulated)","Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1003","Lymphoid"],
["1004-Mature_NK-S","Mature Natural Killer cells (stimulated)","Mature Natural Killer cells, stimulated with 1:2 CD2/CD355 coated beads and 500 U/ml IL-2 for 48 hours, in donor 1004","Lymphoid"],
["1008-Mature_NK-S","Mature Natural Killer cells (stimulated)","Mature Natural Killer cells, stimulated with 200 U/ml IL-2 for 24 hours, in donor 1008","Lymphoid"],
["1010-Mature_NK-S","Mature Natural Killer cells (stimulated)","Mature Natural Killer cells, stimulated with 200 U/ml IL-2 for 24 hours, in donor 1010","Lymphoid"],
["1001-Memory_NK-U","Memory Natural Killer cells","Memory Natural Killer cells in donor 1001","Lymphoid"],
["1002-Memory_NK-U","Memory Natural Killer cells","Memory Natural Killer cells in donor 1002","Lymphoid"],
["1003-Memory_NK-U","Memory Natural Killer cells","Memory Natural Killer cells in donor 1003","Lymphoid"],
["1004-Memory_NK-U","Memory Natural Killer cells","Memory Natural Killer cells in donor 1004","Lymphoid"],
["1008-Memory_NK-U","Memory Natural Killer cells","Memory Natural Killer cells in donor 1008","Lymphoid"],
["1010-Memory_NK-U","Memory Natural Killer cells","Memory Natural Killer cells in donor 1010","Lymphoid"]]

export const CalderonCellTypesMetadata = CalderonCellTypes.map(c=>{
    return {
        name: c[0],        
        description: c[1],
    
    }
})
export const CalderonBigWigTracksMetadata = CalderonBigWigTracks.map(c=>{
 let r= CalderonCellTypes.find(s=>s[1].includes(c[1]))
 //console.log("test",r)
    return {
        name: c[0],
        celltype: c[1],
        description: c[2],
        celltype_name: r?.length>0 ? r[0] : c[1],
        grouping: c[3]
    }
})

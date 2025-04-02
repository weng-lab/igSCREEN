interface NodeInfo {
  /**
   * unique identifier for the node, should match ```celltype``` field of useIcreActivity
   */
  celltype: string
}

/**
 * I think that there should be a way to download the individual sets of active iCREs for each cell types
 * Could be in the table which contains the selected cells
 */

interface CellTypeTreeProps {
  /**
   * Highlights cells in the tree, and greys out the rest
   */
  selected?: string[];
  /**
   * Makes it so that nodes do not grow slightly on hover
   */
  uninteractive?: boolean;
  onNodeClicked?: (node: NodeInfo) => void;
};

function noop(){}

function getCellImagePath(celltype: string): string {
  return '/cellTypes/HSC.png'
}

const NewCellTypeTree = ({selected = [], uninteractive = false, onNodeClicked = noop}: CellTypeTreeProps) => {

  interface TreeNode extends NodeInfo {
    disabled?: boolean
    children?: TreeNode[]
  }

  const data: TreeNode = {
    celltype: "Hematopoetic Stem Cells",
    children: [
      {
        celltype: "Multipotent Progenitors",
        children: [
          {
            celltype: "Common Myeloid Progenitors",
            children: [
              {
                celltype: "Granulocyte-monocyte progenitors",
                children: [
                  {
                    celltype: "Plasmacytoid Dendritic Cells"
                  },
                  {
                    celltype: "Myeloid Dendritic Cells"
                  },
                  {
                    celltype: "Monocytes"
                  },
                  {
                    celltype: "Suppressor Macrophages"
                  },
                  {
                    celltype: "Inflammatory Macrophages"
                  },
                ]
              }
            ]
          },
          {
            celltype: "Megakaryocyte-Erythroid Progenitors",
            children: [
              {
                celltype: "Erythroblasts"
              }
            ]
          },
          {
            celltype: "Lymphoid-Primed Multipotent Progenitor Cells",
            children: [
              {
                celltype: "Common Lymphoid Progenitors",
                children: [
                  {
                    celltype: "Double negative cell",
                    disabled: true,
                    children: [
                      {
                        celltype: "Natural Killer Cells",
                        children: [
                          {
                            celltype: "Immature Natural Killer Cells",
                            children: [
                              {
                                celltype: "Mature Natural Killer Cells",
                                children: [
                                  {
                                    celltype: "Memory Natural Killer Cells",
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        celltype: "T Cells",
                        children: [
                          {
                            celltype: "Gamma Delta T Cells"
                          },
                          {
                            celltype: "Double Positive Cells",
                            disabled: true,
                            children: [
                              {
                                celltype: "CD4+ T Cells",
                                children: [
                                  {
                                    celltype: "Effector CD4+ Tcells",
                                    children: [
                                      {
                                        celltype: "Naive T Effector Cells",
                                        children: [
                                          {
                                            celltype: "Memory T Effector Cells",
                                            children: [
                                              {
                                                celltype: "T-helper 1 Cell"
                                              },
                                              {
                                                celltype: "T-helper 2 Cell"
                                              },
                                              {
                                                celltype: "T-helper 9 Cell"
                                              },
                                              {
                                                celltype: "T-helper 17 Cell"
                                              },
                                              {
                                                celltype: "T-helper 22 Cell"
                                              },
                                              {
                                                celltype: "Follicular T Helper Cells"
                                              }
                                            ]
                                          },
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    celltype: "Regulatory T cells",
                                    children: [
                                      {
                                        celltype: "Naive T Regulatory Cells",
                                        children: [
                                          {
                                            celltype: "Memory T Regulatory Cells",
                                          },
                                        ]
                                      },
                                    ]
                                  },
                                ]
                              },
                              {
                                celltype: "CD8+ T Cells",
                                children: [
                                  {
                                    celltype: "Naive CD8+ T Cells",
                                    children: [
                                      {
                                        celltype: "Central Memory CD8+ T Cells"
                                      },
                                      {
                                        celltype: "Effector Memory CD8+ T Cells"
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    celltype: "B Cells",
                    children: [
                      {
                        celltype: "Naive B Cells",
                        children: [
                          {
                            celltype: "Memory B Cells",
                            children: [
                              {
                                celltype: "Plasmablasts"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }

}

export default NewCellTypeTree
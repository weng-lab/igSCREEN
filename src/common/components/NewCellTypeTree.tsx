import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { HierarchyPointLink, HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { LinkVertical } from "@visx/shape";
import { Text } from "@visx/text";
import { useCallback, useMemo } from "react";

const primaryColor = "#494d6b";

interface NodeInfo {
  /**
   * unique identifier for the node, should match ```celltype``` field of useIcreActivity
   */
  celltype: string;
}

interface CellTypeTreeProps {
  width: number;
  height: number;
  /**
   * Highlights cells in the tree, and greys out the rest. Empty array will grey whole tree, null will grey none
   */
  selected?: string[];
  /**
   * Makes it so that nodes do not grow slightly on hover
   */
  uninteractive?: boolean;
  onNodeClicked?: (node: NodeInfo) => void;
}

function noop() {}

function getCellImagePath(celltype: string): string {
  return "/cellTypes/HSC.png";
}

interface TreeNode extends NodeInfo {
  label: string;
  disabled?: boolean;
  children?: TreeNode[];
}

const tree: TreeNode = {
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
                  celltype: "Plasmacytoid Dendritic Cells",
                },
                {
                  celltype: "Myeloid Dendritic Cells",
                },
                {
                  celltype: "Monocytes",
                },
                {
                  celltype: "Suppressor Macrophages",
                },
                {
                  celltype: "Inflammatory Macrophages",
                },
              ],
            },
          ],
        },
        {
          celltype: "Megakaryocyte-Erythroid Progenitors",
          children: [
            {
              celltype: "Erythroblasts",
            },
          ],
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
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      celltype: "T Cells",
                      children: [
                        {
                          celltype: "Gamma Delta T Cells",
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
                                              celltype: "T-helper 1 Cell",
                                            },
                                            {
                                              celltype: "T-helper 2 Cell",
                                            },
                                            {
                                              celltype: "T-helper 9 Cell",
                                            },
                                            {
                                              celltype: "T-helper 17 Cell",
                                            },
                                            {
                                              celltype: "T-helper 22 Cell",
                                            },
                                            {
                                              celltype: "Follicular T Helper Cells",
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
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
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              celltype: "CD8+ T Cells",
                              children: [
                                {
                                  celltype: "Naive CD8+ T Cells",
                                  children: [
                                    {
                                      celltype: "Central Memory CD8+ T Cells",
                                    },
                                    {
                                      celltype: "Effector Memory CD8+ T Cells",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
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
                              celltype: "Plasmablasts",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const NewCellTypeTree = ({
  width,
  height,
  selected = null,
  uninteractive = false,
  onNodeClicked = noop,
}: CellTypeTreeProps) => {
  const innerMarginTop = 70;
  const innerMarginBottom = 25;
  const innerMarginLeft = 0;
  const innerMarginRight = 0;

  const innerWidth = width - innerMarginLeft - innerMarginRight;
  const innerHeight = height - innerMarginTop - innerMarginBottom;

  const data = useMemo(() => hierarchy(tree), []);

  const Node = useCallback(
    ({ node }: { node: HierarchyPointNode<TreeNode> }) => {
      const width = 60;
      const height = 60;
      const centerX = -width / 2;
      const centerY = -height / 2;
      const top = node.y;
      const left = node.x;

      const isSelected = selected?.includes(node.data.celltype);
      const opacity = !node.data.disabled && (selected === null || isSelected) ? 1 : 0.3;

      return (
        <Group top={top} left={left} onClick={() => !node.data.disabled && onNodeClicked(node.data)} opacity={opacity}>
          {/* Text positioned above the group, all positioning is done relative to image position */}
          <Text y={-45} textAnchor="middle" fontSize={12}>
            {node.data.celltype}
          </Text>
          <image
            href={getCellImagePath(node.data.celltype)}
            width={width}
            height={height}
            x={centerX}
            y={centerY}
            cursor={node.data.disabled ? "not-allowed" : "pointer"}
            onMouseEnter={(event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              if (!uninteractive && !node.data.disabled) {
                event.currentTarget.setAttribute("transform", "scale(1.1)");
                event.currentTarget.setAttribute("opacity", "1");
              }
            }}
            onMouseOut={(event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              if (!uninteractive && !node.data.disabled) {
                event.currentTarget.setAttribute("transform", "scale(1)");
                event.currentTarget.setAttribute("opacity", String(opacity));
              }
            }}
          />
          {isSelected && (
            <rect
              width={width - 5}
              height={height - 5}
              x={centerX + 2.5}
              y={centerY}
              rx={15}
              fill="none"
              stroke={primaryColor}
              strokeWidth={1}
            />
          )}
        </Group>
      );
    },
    [onNodeClicked, selected, uninteractive]
  );

  return innerWidth < 10 ? null : (
    <svg width={width} height={height}>
      <Tree<TreeNode> root={data} size={[innerWidth, innerHeight]}>
        {(tree) => (
          <Group top={innerMarginTop} left={innerMarginLeft}>
            {tree.links().map((link, i) => (
              <LinkVertical<HierarchyPointLink<TreeNode>, HierarchyPointNode<TreeNode>>
                key={`tree-link-${i}`}
                data={link}
                stroke={primaryColor}
                strokeOpacity={0.4}
                //Bold if descendant selected
                strokeWidth={
                  link.target.descendants().find((childNode) => selected?.includes(childNode.data.celltype)) ? 3 : 0.75
                }
                fill="none"
              />
            ))}
            {tree.descendants().map((node, i) => (
              <Node key={`node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Tree>
    </svg>
  );
};

export default NewCellTypeTree;

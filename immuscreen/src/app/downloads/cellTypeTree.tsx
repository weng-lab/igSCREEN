import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
import { LinkHorizontal } from '@visx/shape';
import { CellTypeInfo, CellTypes } from './page';

const linkStroke = '#000000';
const background = 'transparent';

interface CellNode extends CellTypeInfo {
  children?: CellNode[];
}

const uninteractiveNode = {
  imagePath: '',
  selected: false,
  selectable: false,
  stimulated: false,
  stimulable: false,
}

const defaultMargin = { top: 80, left: 0, right: 0, bottom: 40 };

export type CellTypeTreeProps = {
  width: number;
  height: number;
  cellTypeState: CellTypes;
  setCellTypeState: React.Dispatch<React.SetStateAction<CellTypes>>;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function CellTypeTree({ width, height, cellTypeState, setCellTypeState, margin = defaultMargin }: CellTypeTreeProps) {

  const clusterData: CellNode = useMemo(() => {
    return (
      {
        displayName: 'Hematopoietic/stem cell',
        ...uninteractiveNode,
        children: [
          {
            displayName: 'Multipotent/progenitor',
            ...uninteractiveNode,
            children: [
              {
                displayName: 'Common myeloid/progenitor',
                ...uninteractiveNode,
                children: [
                  {
                    displayName: 'Granuloctye-monocyte/progenitor',
                    ...uninteractiveNode,
                    children: [
                      {
                        displayName: 'Neutrophil',
                        ...uninteractiveNode,
                      },
                      {
                        ...cellTypeState.pDCs
                      },
                      {
                        ...cellTypeState.Myeloid_DCs
                      },
                      {
                        ...cellTypeState.Monocytes
                      }
                    ]
                  }
                ]
              },
              {
                displayName: 'Megakaryocyte-erythroid/progenitor',
                ...uninteractiveNode,
                children: [
                  {
                    displayName: 'Erythrocyte',
                    ...uninteractiveNode,
                  }
                ]
              },
              {
                displayName: 'Lymphoid-primed/multipotent progenitor',
                ...uninteractiveNode,
                children: [
                  {
                    displayName: 'Common lymphoid/progenitor',
                    ...uninteractiveNode,
                    children: [
                      {
                        displayName: 'Double-negative cell',
                        ...uninteractiveNode,
                        children: [
                          {
                            ...cellTypeState.Immature_NK,
                            children: [
                              {
                                ...cellTypeState.Mature_NK,
                                children: [
                                  {
                                    ...cellTypeState.Memory_NK,
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            ...cellTypeState.Gamma_delta_T,
                          },
                          {
                            displayName: 'CD4 immature/single-positive cell',
                            ...uninteractiveNode,
                            children: [
                              {
                                displayName: 'Double-positive/cell',
                                ...uninteractiveNode,
                                children: [
                                  {
                                    displayName: 'CD4+ T cell',
                                    ...uninteractiveNode,
                                    children: [
                                      {
                                        ...cellTypeState.Effector_CD4pos_T,
                                        children: [
                                          {
                                            ...cellTypeState.Naive_Teffs,
                                            children: [
                                              {
                                                ...cellTypeState.Memory_Teffs,
                                                children: [
                                                  {
                                                    ...cellTypeState.Th1_precursors
                                                  },
                                                  {
                                                    ...cellTypeState.Th2_precursors
                                                  },
                                                  {
                                                    ...cellTypeState.Th17_precursors
                                                  },
                                                  {
                                                    ...cellTypeState.Follicular_T_Helper
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      },
                                      {
                                        ...cellTypeState.Regulatory_T,
                                        children: [
                                          {
                                            ...cellTypeState.Naive_Tregs,
                                            children: [
                                              {
                                                ...cellTypeState.Memory_Tregs
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    ...cellTypeState.CD8pos_T,
                                    children: [
                                      {
                                        ...cellTypeState.Naive_CD8_T,
                                        children: [
                                          {
                                            ...cellTypeState.Central_memory_CD8pos_T
                                          },
                                          {
                                            ...cellTypeState.Effector_memory_CD8pos_T
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                        ]
                      },
                      {
                        ...cellTypeState.Bulk_B,
                        children: [
                          {
                            ...cellTypeState.Naive_B,
                            children: [
                              {
                                ...cellTypeState.Mem_B,
                                children: [
                                  {
                                    ...cellTypeState.Plasmablasts
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
    )
  }, [cellTypeState])

  const data = useMemo(() => hierarchy<CellNode>(clusterData), [clusterData]);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  function Node({ node }: { node: HierarchyPointNode<CellNode> }) {
    const width = 60;
    const height = 60;
    const centerX = -width / 2;
    const centerY = -height / 2;

    return (
      <Group top={node.y} left={node.x}
        onClick={() => {
          node.data.selectable && window.alert("clicked " + node.data.displayName)
        }}
      >
        <text
          x='50%'
          y={(-4.5 - (1.25 * (node.data.displayName.split('/').length - 1))).toString() + '%'}
          fontSize={11}
          fontFamily="Arial"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
        >
          {node.data.displayName.split('/').map((str, i) => {
            return (
              <tspan key={i} x="0" dy="1.2em">{str}</tspan>
            )
          })}
        </text>
        <image
          href={node.data.imagePath}
          width={width}
          height={height}
          y={centerY}
          x={centerX}
          opacity={node.data.selected ? 1 : 0.2}
          onMouseEnter={
            (event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              node.data.selectable &&
                //If selected, lower opacity. If unselected, raise opacity
                node.data.selected ?
                event.currentTarget.setAttribute('opacity', '0.2')
                :
                event.currentTarget.setAttribute('opacity', '1')
              event.currentTarget.setAttribute('transform', 'scale(1.1)')
            }
          }
          onMouseLeave={
            (event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              node.data.selectable &&
                //If selected, set opactiy back to 1. If unselected, set opactiy back down
                node.data.selected ?
                event.currentTarget.setAttribute('opacity', '1')
                :
                event.currentTarget.setAttribute('opacity', '0.2')
              event.currentTarget.setAttribute('transform', 'scale(1)')
            }
          }
        />
      </Group>
    );
  }

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill={background} />
      <Tree<CellNode> root={data} size={[xMax, yMax]}>
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {tree.links().map((link, i) => (
              <LinkVertical<HierarchyPointLink<CellNode>, HierarchyPointNode<CellNode>>
                key={`cluster-link-${i}`}
                data={link}
                stroke={linkStroke}
                strokeWidth="1"
                strokeOpacity={0.2}
                fill="none"
              />
            ))}
            {tree.descendants().map((node, i) => (
              <Node key={`cluster-node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Tree>
    </svg>
  );
}
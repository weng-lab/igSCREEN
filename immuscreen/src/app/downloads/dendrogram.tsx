'use client'
import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
import { LinkHorizontal } from '@visx/shape';
import { CellTypes } from './page';

const linkStroke = '#000000';
const background = 'transparent';

interface NodeShape {
  ctName: string;
  displayName: string;
  image: string;
  selected: boolean;
  children?: NodeShape[];
}

const defaultMargin = { top: 80, left: 0, right: 0, bottom: 40 };

export type CellTypeTreeProps = {
  width: number;
  height: number;
  selectedCells: CellTypes;
  setSelectedCells: React.Dispatch<React.SetStateAction<CellTypes>>;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function CellTypeTree({ width, height, selectedCells, setSelectedCells, margin = defaultMargin }: CellTypeTreeProps) {

  const clusterData: NodeShape = useMemo(() => {
    return (
      {
        ctName: 'UNDEFINED',
        displayName: 'Hematopoietic/stem cell',
        image: '',
        selected: false,
        children: [
          {
            ctName: 'UNDEFINED',
            displayName: 'Multipotent/progenitor',
            image: '',
            selected: false,
            children: [
              {
                ctName: 'UNDEFINED',
                displayName: 'Common myeloid/progenitor',
                image: '',
                selected: false,
                children: [
                  {
                    ctName: 'UNDEFINED',
                    displayName: 'Granuloctye-monocyte/progenitor',
                    image: '',
                    selected: false,
                    children: [
                      {
                        ctName: 'UNDEFINED',
                        displayName: 'Neutrophil',
                        image: '',
                        selected: false,
                      },
                      {
                        ctName: 'pDCs',
                        displayName: 'Plasmacytoid/dendritic cell',
                        image: '/cellTypes/pDCs.png',
                        selected: true,
                      },
                      {
                        ctName: 'Myeloid_DCs',
                        displayName: 'Myeloid/dendritic cell',
                        image: '/cellTypes/Myeloid_DCs.png',
                        selected: true,
                      },
                      {
                        ctName: 'Monocyte',
                        displayName: 'Monocyte',
                        image: '/cellTypes/Monocytes.png',
                        selected: true,
                      }
                    ]
                  }
                ]
              },
              {
                ctName: 'UNDEFINED',
                displayName: 'Megakaryocyte-erythroid/progenitor',
                image: '',
                selected: false,
                children: [
                  {
                    ctName: 'UNDEFINED',
                    displayName: 'Erythroid',
                    image: '',
                    selected: false,
                  }
                ]
              },
              {
                ctName: 'UNDEFINED',
                displayName: 'Lymphoid-primed/multipotent progenitor',
                image: '',
                selected: false,
                children: [
                  {
                    ctName: 'UNDEFINED',
                    displayName: 'Common lymphoid/progenitor',
                    image: '',
                    selected: false,
                    children: [
                      {
                        ctName: 'UNDEFINED',
                        displayName: 'Double-negative cell',
                        image: '',
                        selected: false,
                        children: [
                          {
                            ctName: 'Immature_NK',
                            displayName: 'Immature/NK cell',
                            image: '/cellTypes/Immature_NK.png',
                            selected: true,
                            children: [
                              {
                                ctName: 'Mature_NK',
                                displayName: 'Mature/NK cell',
                                image: '/cellTypes/Mature_NK.png',
                                selected: true,
                                children: [
                                  {
                                    ctName: 'Memory_NK',
                                    displayName: 'Memory/NK cell',
                                    image: '/cellTypes/Memory_NK.png',
                                    selected: true,
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            ctName: 'Gamma_delta_T',
                            displayName: 'T cell',
                            image: '/cellTypes/Gamma_delta_T.png',
                            selected: true,
                          },
                          {
                            ctName: 'UNDEFINED',
                            displayName: 'CD4 immature/single-positive cell',
                            image: '',
                            selected: false,
                            children: [
                              {
                                ctName: 'UNDEFINED',
                                displayName: 'Double-positive/cell',
                                image: '',
                                selected: false,
                                children: [
                                  {
                                    ctName: 'UNDEFINED',
                                    displayName: 'mCD4 T cell',
                                    image: '',
                                    selected: false,
                                    children: [
                                      {
                                        ctName: 'Effector_CD4',
                                        displayName: 'Effector CD4+/T cell',
                                        image: '/cellTypes/Effector_CD4pos_T.png',
                                        selected: true,
                                        children: [
                                          {
                                            ctName: 'Naive_Teffs',
                                            displayName: 'Naïve T/effector cell',
                                            image: '/cellTypes/Naive_teffs.png',
                                            selected: true,
                                            children: [
                                              {
                                                ctName: 'Memory_Teffs',
                                                displayName: 'Memory T/effector cell',
                                                image: '/cellTypes/Memory_Teffs.png',
                                                selected: true,
                                                children: [
                                                  {
                                                    ctName: 'Th1_precursors',
                                                    displayName: 'Th1/precursor',
                                                    image: '/cellTypes/Th1_precursors.png',
                                                    selected: true
                                                  },
                                                  {
                                                    ctName: 'Th2_precursors',
                                                    displayName: 'Th2/precursor',
                                                    image: '/cellTypes/Th2_precursors.png',
                                                    selected: true
                                                  },
                                                  {
                                                    ctName: 'Th17_precursors',
                                                    displayName: 'Th17/precursor',
                                                    image: '/cellTypes/Th17_precursors.png',
                                                    selected: true
                                                  },
                                                  {
                                                    ctName: 'Follicular_T_Helper',
                                                    displayName: 'T follicular/helper cell',
                                                    image: '/cellTypes/Follicular_T_helper.png',
                                                    selected: true
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      },
                                      {
                                        ctName: 'Regulatory_T',
                                        displayName: 'Regulatory CD4+/T cell',
                                        image: '/cellTypes/Regulatory_T.png',
                                        selected: true,
                                        children: [
                                          {
                                            ctName: 'Naive_Tregs',
                                            displayName:'Naïve T/regulatory cell',
                                            image: '/cellTypes/Naive_Tregs.png',
                                            selected: true,
                                            children: [
                                              {
                                                ctName: 'Memory_Tregs',
                                                displayName: 'Memory T/regulatory cell',
                                                image: '/cellTypes/Memory_Tregs.png',
                                                selected: true
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    ctName: 'CD8pos_T',
                                    displayName: 'CD8+/T cell',
                                    image: '/cellTypes/CD8pos_T.png',
                                    selected: true,
                                    children: [
                                      {
                                        ctName: 'Naive_CD8_T',
                                        displayName: 'Naïve CD8+/T cell',
                                        image: '/cellTypes/Naive_CD8_T.png',
                                        selected: true,
                                        children: [
                                          {
                                            ctName: 'Central_memory_CD8pos_T',
                                            displayName: 'Central/memory/CD8+ T cell',
                                            image: '/cellTypes/Central_Memory_CD8pos_T.png',
                                            selected: true,
                                          },
                                          {
                                            ctName: 'Effector_memory_CD8pos_T',
                                            displayName: 'Effector/memory/CD8+ T cell',
                                            image: '/cellTypes/Effector_memory_CD8pos_T.png',
                                            selected: true,
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
                        ctName: 'Bulk_B',
                        displayName: 'Bulk B cell',
                        image: '/cellTypes/Bulk_B.png',
                        selected: true,
                        children: [
                          {
                            ctName: 'Naive_B',
                            displayName: 'Naïve B cell',
                            image: '/cellTypes/Naive_B.png',
                            selected: true,
                            children: [
                              {
                                ctName: 'Mem_B',
                                displayName: 'Memory B cell',
                                image: '/cellTypes/Mem_B.png',
                                selected: true,
                                children: [
                                  {
                                    ctName: 'Plasmablasts',
                                    displayName: 'Plasmablast',
                                    image: '/cellTypes/Plasmablasts.png',
                                    selected: true,
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
  }, [selectedCells])

  const data = useMemo(() => hierarchy<NodeShape>(clusterData), []);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  function Node({ node }: { node: HierarchyPointNode<NodeShape> }) {
    const width = 60;
    const height = 60;
    const centerX = -width / 2;
    const centerY = -height / 2;

    return (
      <Group top={node.y} left={node.x}
        onClick={() => {
          // setSelectedCells({bulk_b: !node.data.selected})
          window.alert("clicked " + node.data.ctName)
        }}
      >
        <text
          x='50%'
          // dy="-4.5em"
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
          href={node.data.image}
          width={width}
          height={height}
          y={centerY}
          x={centerX}
          opacity={node.data.selected ? 1 : 0.4}
          onMouseEnter={
            (event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              event.currentTarget.setAttribute('opacity', '1')
              event.currentTarget.setAttribute('transform', 'scale(1.1)')
            }
          }
          onMouseLeave={
            (event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              event.currentTarget.setAttribute('opacity', `${node.data.selected ? 1 : 0.4}`)
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
      <Tree<NodeShape> root={data} size={[xMax, yMax]}>
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {tree.links().map((link, i) => (
              <LinkVertical<HierarchyPointLink<NodeShape>, HierarchyPointNode<NodeShape>>
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
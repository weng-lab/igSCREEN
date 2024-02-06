'use client'
import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Cluster, Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
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

const defaultMargin = { top: 40, left: 0, right: 0, bottom: 40 };

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
        displayName: 'Hematopoietic stem cell',
        image: '',
        selected: true,
        children: [
          {
            ctName: 'UNDEFINED',
            displayName: 'Multipotent progenitor',
            image: '',
            selected: true,
            children: [
              {
                ctName: 'UNDEFINED',
                displayName: 'Common myeloid progenitor',
                image: '',
                selected: true,
                children: [
                  {
                    ctName: 'UNDEFINED',
                    displayName: 'Granuloctye-monocyte progenitor',
                    image: '',
                    selected: true,
                    children: [
                      {
                        ctName: 'UNDEFINED',
                        displayName: 'Neutrophil',
                        image: '',
                        selected: true,
                      },
                      {
                        ctName: 'pDCs',
                        displayName: 'Plasmacytoid dendritic cell',
                        image: 'pDCs.png',
                        selected: true,
                      },
                      {
                        ctName: 'Myeloid_DCs',
                        displayName: 'Myeloid dendritic cell',
                        image: 'Myeloid_DCs.png',
                        selected: true,
                      },
                      {
                        ctName: 'Monocyte',
                        displayName: 'Monocyte',
                        image: 'Monocytes.png',
                        selected: true,
                      }
                    ]
                  }
                ]
              },
              {
                ctName: 'UNDEFINED',
                displayName: 'Megakaryocyte-erythroid progenitor',
                image: '',
                selected: true,
                children: [
                  {
                    ctName: 'UNDEFINED',
                    displayName: 'Erythroid',
                    image: '',
                    selected: true,
                  }
                ]
              },
              {
                ctName: 'UNDEFINED',
                displayName: 'Lymphoid-primed multipotent progenitor',
                image: '',
                selected: true,
                children: [
                  {
                    ctName: 'UNDEFINED',
                    displayName: 'Common lymphoid progenitor',
                    image: '',
                    selected: true,
                    children: [
                      {
                        ctName: 'UNDEFINED',
                        displayName: 'Double-negative cell',
                        image: '',
                        selected: true,
                        children: [
                          {
                            ctName: 'Immature_NK',
                            displayName: 'Immature NK cell',
                            image: 'Immature_NK.png',
                            selected: true,
                            children: [
                              {
                                ctName: 'Mature_NK',
                                displayName: 'Mature NK cell',
                                image: 'Mature_NK.png',
                                selected: true,
                                children: [
                                  {
                                    ctName: 'Memory_NK',
                                    displayName: 'Memory NK cell',
                                    image: 'Memory_NK.png',
                                    selected: true,
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            ctName: 'Gamma_delta_T',
                            displayName: 'T cell',
                            image: 'Gamma_delta_T.png',
                            selected: true,
                          },
                          {
                            ctName: 'UNDEFINED',
                            displayName: 'CD4 immature single-positive cell',
                            image: '',
                            selected: true,
                            children: [
                              {
                                ctName: 'UNDEFINED',
                                displayName: 'Double-positive cell',
                                image: '',
                                selected: true,
                              }
                            ]
                          },
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
          dy="-2.5em"
          fontSize={11}
          fontFamily="Arial"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
        >
          {node.data.displayName}
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
import React, { useEffect, useMemo } from 'react';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkHorizontal, LinkVertical } from '@visx/shape';
import { CellTypeInfo, CellTypes } from '../../app/upset/page';
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';

const linkStroke = '#000000';
const background = 'transparent';
const fontSize = 12

const fadedCellOpacity = 0.3

interface CellNode extends CellTypeInfo {
  children?: CellNode[];
}

const uninteractiveNode = {
  id: null,
  unstimImagePath: null,
  selected: false,
  selectable: false,
  stimulated: "U" as "U" | "S" | "B",
  stimulable: false,
  unstimCount: 0
}

interface TooltipData {
  name: string;
  unstimCount: number;
  stimCount?: number;
}

type CellTypeTreeProps = {
  width: number
  height: number
  cellTypeState: CellTypes
  setCellTypeState: React.Dispatch<React.SetStateAction<CellTypes>>
  stimulateMode: boolean
  setStimulateMode: React.Dispatch<React.SetStateAction<boolean>>
  setCursor: React.Dispatch<React.SetStateAction<"auto" | "pointer" | "cell" | "not-allowed">>
  orientation: "vertical" | "horizontal"
  selectionLimit?: number
  triggerAlert: (message: string) => void
}

export default function CellTypeTree({ width: totalWidth, height: totalHeight, orientation, cellTypeState, setCellTypeState, stimulateMode, setStimulateMode, setCursor, selectionLimit, triggerAlert }: CellTypeTreeProps) {

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } = useTooltip<TooltipData>();

  let sizeWidth: number;
  let sizeHeight: number;
  let innerMarginTop: number;
  let innerMarginBottom: number;
  let innerMarginLeft: number;
  let innerMarginRight: number;
  let innerWidth: number;
  let innerHeight: number;

  if (orientation === 'vertical') {
    innerMarginTop = 70;
    innerMarginBottom = 25;
    innerMarginLeft = 0;
    innerMarginRight = 0;
  } else {
    innerMarginTop = 0;
    innerMarginBottom = 0;
    innerMarginLeft = 40;
    innerMarginRight = 40;
  }

  innerWidth = totalWidth - innerMarginLeft - innerMarginRight;
  innerHeight = totalHeight - innerMarginTop - innerMarginBottom;
  sizeWidth = orientation === 'vertical' ? innerWidth : innerHeight;
  sizeHeight = orientation === 'vertical' ? innerHeight : innerWidth;

  /**
   * Rotates the stimulation between U/S/B in that order
   */
  const toggleStimulation = (current: "U" | "S" | "B", numberSelected: number, selectionLimit: number): "U" | "S" | "B"  => {
    switch (current) {
      case ("U"): {if (numberSelected === selectionLimit){return "S"} else {return "S"}}
      case ("S"): {if (numberSelected === selectionLimit){return "U"} else {return "B"}}
      case ("B"): return "U"
    }
  }

  //For tracking user holding down 
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Alt" || event.key === "Meta") {
        setStimulateMode(true);
        setCursor("cell")
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt" || event.key === "Meta") {
        setStimulateMode(false);
        setCursor("auto")
      }
    };

    // Attach event listeners to the document
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Cleanup: Remove event listeners when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array ensures that the effect runs only once

  const clusterData: CellNode = useMemo(() => {
    return (
      {
        ...cellTypeState.HSC,
        children: [
          {
            ...cellTypeState.MPP,
            children: [
              {
                ...cellTypeState.CMP,
                children: [
                  {
                    ...cellTypeState.GMP,
                    children: [
                      // {
                      //   displayName: 'Neutrophil',
                      //   ...uninteractiveNode,
                      // },
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
                ...cellTypeState.MEP,
                children: [
                  {
                    ...cellTypeState.Ery,
                  }
                ]
              },
              {
                ...cellTypeState.LPMP,
                children: [
                  {
                    ...cellTypeState.CLP,
                    children: [
                      {
                        displayName: 'Double-negative cell',
                        ...uninteractiveNode,
                        children: [
                          {
                            ...cellTypeState.Nkcell,
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
                                    ...cellTypeState.CD4Tcell,
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

  const data = useMemo(() => { console.log("data memo"); return hierarchy<CellNode>(clusterData) }, [clusterData]);

  function Node({ node }: { node: HierarchyPointNode<CellNode> }) {
    const width = 60;
    const height = 60;
    const centerX = -width / 2;
    const centerY = -height / 2;

    let top: number;
    let left: number;
    if (orientation === 'vertical') {
      top = node.y;
      left = node.x;
    } else {
      top = node.x;
      left = node.y;
    }

    if (node.data.displayName === "Plasmablast") { console.log("rerendering nodes") }


    return (
      <Group
        top={top}
        left={left}
      >
        <text
          y={-60 - ((fontSize + 2) * (node.data.displayName.split('/').length - 1))}
          fontSize={fontSize}
          fontFamily="Arial"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
        >
          {node.data.displayName.split('/').map((str, i) => {
            return (
              <tspan key={i} x="0" dy={fontSize + 2}>{str}</tspan>
            )
          })}
          <tspan x="0" dy={fontSize + 2}>
            {(node.data.stimulated === "S" ? '(Stim)' : node.data.stimulated === "B" ? '(Unstim + Stim)' : '(Unstim)')}
          </tspan>
        </text>
        <Group
          opacity={(node.data.selected || Object.values(cellTypeState).every(cellType => cellType.selected === false)) ? 1 : fadedCellOpacity}
          onClick={() => {
            const numberSelected = Object.values(cellTypeState).reduce((count, cellInfo: CellTypeInfo) => cellInfo.selected ? cellInfo.stimulated === "B" ? count + 2 : count + 1 : count, 0)
            if (stimulateMode) {
              if (node.data.stimulable) {
                setCellTypeState({
                  ...cellTypeState,
                  [node.data.id]: {
                    ...cellTypeState[node.data.id],
                    stimulated: toggleStimulation(cellTypeState[node.data.id].stimulated, numberSelected, selectionLimit)
                  }
                })
              }
            } else if (node.data.selectable) {
              //If there is room for selection, select it. Or always allow deselection
              if (((node.data.stimulated === "B" ? numberSelected + 2 : numberSelected + 1) <= selectionLimit) || node.data.selected) {
                setCellTypeState({
                  ...cellTypeState,
                  [node.data.id]: { ...cellTypeState[node.data.id], selected: !cellTypeState[node.data.id].selected }
                })
              } else triggerAlert("Maximum cell selection reached (6)")
            }
          }}
          onMouseEnter={
            (event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              if (node.data.selectable) {
                if (stimulateMode && !node.data.stimulable) {
                  setCursor("not-allowed")
                } else {
                  event.currentTarget.setAttribute('transform', 'scale(1.1)')
                  event.currentTarget.setAttribute('opacity', '1')
                  !stimulateMode && setCursor('pointer')
                }
                showTooltip({
                  tooltipTop: top,
                  tooltipLeft: left,
                  tooltipData: {
                    name: node.data.displayName,
                    unstimCount: node.data.unstimCount,
                    stimCount: node.data?.stimCount
                  }
                })
              }
            }
          }
          onMouseOut={
            (event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              if (node.data.selectable) {
                if (stimulateMode && !node.data.stimulable) {
                  !node.data.stimulable && setCursor("cell")
                } else {
                  event.currentTarget.setAttribute('transform', 'scale(1)')
                  event.currentTarget.setAttribute('opacity', (node.data.selected || Object.values(cellTypeState).every(cellType => cellType.selected === false)) ? '1' : String(fadedCellOpacity))
                  !stimulateMode && setCursor('auto')
                }
                hideTooltip()
              }
            }
          }
        >
          {node.data.stimulated === "U" &&
            <image
              href={node.data.unstimImagePath}
              width={width}
              height={height}
              y={centerY}
              x={centerX}
            />
          }
          {node.data.stimulated === "S" &&
            <image
              href={node.data.stimImagePath}
              width={width}
              height={height}
              y={centerY}
              x={centerX}
            />
          }
          {node.data.stimulated === "B" &&
            <>
              <image
                href={node.data.stimImagePath}
                width={width}
                height={height}
                y={centerY}
                x={centerX + 10}
              />
              <image
                href={node.data.unstimImagePath}
                width={width}
                height={height}
                y={centerY}
                x={centerX - 10}
              />
            </>
          }
        </Group>
      </Group>
    );
  }

  const TreeMemo = useMemo(() =>
    <Tree<CellNode> root={data} size={[sizeWidth, sizeHeight]}>
      {(tree) => (
        <Group top={innerMarginTop} left={innerMarginLeft}>
          {tree.links().map((link, i) => (
            orientation === "vertical" ?
              <LinkVertical<HierarchyPointLink<CellNode>, HierarchyPointNode<CellNode>>
                key={`cluster-link-${i}`}
                data={link}
                stroke={linkStroke}
                //Bold if descendant selected
                strokeWidth={link.target.descendants().find((childNode) => childNode.data.selected) !== undefined ? 3 : 0.75}
                strokeOpacity={0.4}
                fill="none"
              />
              :
              <LinkHorizontal<HierarchyPointLink<CellNode>, HierarchyPointNode<CellNode>>
                key={`cluster-link-${i}`}
                data={link}
                stroke={linkStroke}
                //Bold if descendant selected
                strokeWidth={link.target.descendants().find((childNode) => childNode.data.selected) !== undefined ? 3 : 0.75}
                strokeOpacity={0.4}
                fill="none"
              />
          ))}
          {tree.descendants().map((node, i) => (
            <Node key={`cluster-node-${i}`} node={node} />
          ))}
        </Group>
      )}
    </Tree>
    , [data, stimulateMode])

  return totalWidth < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg width={totalWidth} height={totalHeight}>
        <rect width={totalWidth} height={totalHeight} fill={background} />
        {TreeMemo}
      </svg>
      {tooltipOpen && tooltipData && (
          <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
        >
          <div>
            <strong>{tooltipData.name.replace('/', '\u00A0').replace(' ', '\u00A0').replace('-', '\u2011')}</strong>
          </div>
          <div>
            <p>{'Active\u00A0iCREs:'}</p>
          </div>
          <div>
            <p>Unstimulated: {tooltipData.unstimCount}</p>
          </div>
          {tooltipData.stimCount && <div>
            <p>Stimulated: {tooltipData.stimCount}</p>
          </div>}
        </TooltipWithBounds>       
      )}
    </div>
  );
}
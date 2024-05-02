import React, { useMemo } from "react"
import { Circle, Polygon } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { MouseEvent } from "react";
import { Text } from '@visx/text';
import {
  Legend, LegendLinear, LegendItem, LegendLabel, LegendOrdinal,
} from "@visx/legend";
import { GlyphTriangle, GlyphCircle } from "@visx/glyph";
import { CellName, CellQueryValue, CellTypeStaticInfo } from "../../app/celllineage/types";
import { getCellColor, getCellDisplayName } from "../../app/celllineage/utils";
import { cellTypeStaticInfo, experimentInfo } from "../consts";


export type UmapPoint = {
  name: string,
  value: number,
  donor: string,
  celltype: string,
  class: string,
  stimulation: string,
  umap_1: number,
  umap_2: number
}

interface TooltipData {
  name: string,
  value: number,
  donor: string,
  celltype: string,
  class: string
}


function UMAPPlotLegend({ title, children }: { title: string; children: React.ReactNode; }) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style jsx>{`
          .legend {
            line-height: 0.9em;
            color: #000000;
            font-size: 15px;
            font-family: arial;
            float: left;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
          }
          .title {
            font-size: 15px;
            margin-bottom: 10px;
            font-weight: 500;
          }
        `}</style>
    </div>
  );
}

//This should eventually be redone. It feels wrong to style the tooltip this way
const CellTypesLegends = ({ title, plottitle, children }: { title: string; plottitle?: string; children: React.ReactNode }) => {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style>{`
          .legend {
            line-height: 0.9em;
            color: #efefef;
            font_Size: 10px;
            font-family: arial;
            padding: 10px 10px;
            float: left;
            border: 1px solid rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            margin: 5px 5px;
          }
          .title {
            font_Size: 12px;
            margin-bottom: 10px;
            font-weight: 900;
            color:  #000000;
          }
          .maintitle {
            font-Size: 24px;
            text-align: center;
            margin-bottom: 10px;
            font-weight: 1400;
            color:  #000000;
          }
        `}</style>
    </div>
  );
}

/**
 * @todo this file needs to be typed. Also the manual css injection with <style> is not great IMO -J
 */
export const UmapPlot = (props) => {

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<TooltipData>();
  const handleHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: UmapPoint) => {
    showTooltip({
      tooltipTop: event.pageY,
      tooltipLeft: event.pageX,
      tooltipData: {
        name: point.name,
        value: point.value,
        donor: point.donor,
        celltype: point.celltype,
        class: point.class
      }
    })
  }
  const handleLeaveHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: UmapPoint) => {
    hideTooltip()
  }

  const spaceForAxis = 70
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 80
  const width = 800
  const height = 600
  const plotWidth = width - spaceForAxis - paddingRight
  const plotHeight = height - paddingTop - paddingBottom

  const xMin: number = Math.min(...props.data.map(x => x.umap_1))
  const xMax: number = Math.max(...props.data.map(x => x.umap_1))
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [xMin - 0.5, xMax + 0.5],
        range: [0, plotWidth], //Start at 20 to provide left side padding to data points
      }),
    [plotWidth, props],
  );

  const yMin: number = Math.min(...props.data.map(x => x.umap_1))
  const yMax: number = Math.max(...props.data.map(x => x.umap_2))
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [yMin - 0.5, yMax + 0.5],
        range: [plotHeight, 0]
      }),
    [yMin, yMax, plotHeight],
  );

  const maxValue = Math.max(...props.data.map(a => a.value))
  const minValue = Math.min(...props.data.map(a => a.value))

  const linearScale = scaleLinear({
    domain: [minValue, maxValue],
    range: ["#ffcd00", "#ff0000"],
  });

  let uniqcelltypes = [...new Set([...props.data].sort((a, b) => experimentInfo[a.name].order - experimentInfo[b.name].order).map(c => getCellDisplayName(c.celltype as any)))]

  let ordinalColorScale = uniqcelltypes && scaleOrdinal({
    domain: uniqcelltypes,
    //Duplicates?
    range: uniqcelltypes.map((c) => getCellColor(c as CellName)),

  })

  const legendGlyphSize = 15;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: '40px' }}>
      <svg width={width} height={height}>
        <rect width={width} height={height} rx={14} fill="none" stroke="black" />
        <Group top={paddingTop} left={spaceForAxis}>
          <Text x={width - 80} y={0} textAnchor="end" fontSize={12}>{"\u25EF unstimulated, \u25B3 stimulated "}</Text>
          <AxisLeft
            label="UMAP-1"
            labelProps={{ fontSize: 14 }}
            scale={yScale}
            numTicks={4}
          />
          <AxisBottom
            top={height - paddingBottom}
            label="UMAP-2"
            labelProps={{ fontSize: 14 }}
            numTicks={4}
            scale={xScale}
          />
          {props.data.map(point => {
            return (
              <Group key={`datapoint-${point.umap_1}-${point.umap_2}`}>
                {point.stimulation === 'S' ?
                  <Polygon
                    center={{ x: xScale(point.umap_1), y: yScale(point.umap_2) }}
                    sides={3}
                    size={6}
                    rotate={90}
                    onMouseOver={(event) => handleHover(event, point)}
                    onMouseLeave={(event) => handleLeaveHover(event, point)}
                    fill={(props.colorScheme === 'geneexp' || props.colorScheme === 'ZScore') ? linearScale(point.value) : getCellColor(point.celltype)}
                    stroke={tooltipData && tooltipData.celltype === point.celltype ? 'black' : ''}
                  /> :
                  <Circle
                    r={5}
                    cx={xScale(point.umap_1)}
                    cy={yScale(point.umap_2)}
                    onMouseOver={(event) => handleHover(event, point)}
                    onMouseLeave={(event) => handleLeaveHover(event, point)}
                    //fill= {`${linearScale(point.value)}`}
                    fill={(props.colorScheme === 'geneexp' || props.colorScheme === 'ZScore') ? linearScale(point.value) : getCellColor(point.celltype)}
                    stroke={tooltipData && tooltipData.celltype === point.celltype ? 'black' : ''}
                  />
                }
              </Group>)
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
        >
          <div style={{ maxWidth: "20rem" }}>
            <p><b>Celltype:</b> {getCellDisplayName(tooltipData.celltype as CellQueryValue, true)}</p>
          </div>
          <div>
            <p><b>Name:</b> {tooltipData.name}</p>
          </div>
          <div>
            <p><b>Class</b> {tooltipData.class}</p>
          </div>
          <div>
            <p><b>Value</b> {tooltipData.value.toFixed(2)}</p>
          </div>
        </TooltipWithBounds>
      )}
      <div className="legends">
        {(props.colorScheme === 'geneexp' || props.colorScheme === 'ZScore') ?
          <UMAPPlotLegend title={props.plottitle}>
            <LegendLinear
              scale={linearScale}
              labelFormat={(d, i) => (+d).toFixed(2)}
            >
              {(labels) =>
                labels.sort((a, b) => b.index - a.index).map((label, i) => (
                  <LegendItem
                    key={`legend-linear-${i}`}
                    onClick={() => {
                      //if (events) alert(`clicked: ${JSON.stringify(label)}`);
                    }}
                  >
                    <svg
                      width={legendGlyphSize}
                      height={legendGlyphSize}
                      style={{ margin: "2px 0" }}
                    >
                      <circle
                        fill={label.value}
                        r={legendGlyphSize / 2}
                        cx={legendGlyphSize / 2}
                        cy={legendGlyphSize / 2}
                      />
                    </svg>
                    <LegendLabel align="left" margin="0 4px">
                      {label.text}
                    </LegendLabel>
                  </LegendItem>
                ))
              }
            </LegendLinear>
          </UMAPPlotLegend>
          :
          <CellTypesLegends title={"Immune Cell Types"} plottitle={props.plottitle}>
            <LegendOrdinal scale={ordinalColorScale}>
              {(labels) => (
                <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: '10px', maxHeight: '500px' }}>
                  {labels.map((label, i) => {
                    return (
                      <LegendItem
                        key={`legend-quantile-${i}`}
                        margin="0 5px"
                      >
                        <svg width={legendGlyphSize} height={legendGlyphSize}>
                          <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                        </svg>
                        <LegendLabel align="left" margin="0 10px 0 4px" color={"#ff0000"}>
                          <p className={"labelcolor"}>
                            {label.text}
                          </p>
                        </LegendLabel>
                      </LegendItem>
                    )
                  })}
                </div>
              )}
            </LegendOrdinal>
          </CellTypesLegends>
        }
        <style>
          {`
            .legends {
              display: flex;
              font-family: arial;       
              border-radius: 14px;      
            }
            .labelcolor {
              color:  #000000;
            }
          `}
        </style>
      </div>
    </div>
  )
}
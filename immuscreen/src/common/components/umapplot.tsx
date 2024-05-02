import React, { useMemo } from "react"
import { Circle, Polygon } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { MouseEvent } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import {
  Legend, LegendLinear, LegendItem, LegendLabel,
} from "@visx/legend";
import { GlyphTriangle, GlyphCircle } from "@visx/glyph";
import { CellQueryValue, CellTypeStaticInfo } from "../../app/celllineage/types";
import { getCellColor, getCellDisplayName } from "../../app/celllineage/utils";
import { cellTypeStaticInfo } from "../consts";


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
            padding: 10px 10px;
            float: left;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            margin-top: 150px;
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

  const valueLinearScale = scaleLinear({
    domain: [minValue, maxValue],
    range: [0.1, 1],
  });

  const shapeScale = scaleOrdinal<string, React.FC | React.ReactNode>({
    domain: ["unstimulated", "stimulated"],
    range: [
      <GlyphCircle
        key="unstimulated"
        size={50}
        top={50 / 6}
        left={50 / 6}
        fill="black"
      />,
      <GlyphTriangle
        key="stimulated"
        size={50}
        top={50 / 6}
        left={50 / 6}
        fill="black"
      />
    ],
  });

  const legendGlyphSize = 15;
  return (
    <Grid2 container>
      <Grid2 xs={8}>
        <svg width={width} height={height}>
          <rect width={width} height={height} rx={14} fill="none" stroke="black" />
          <Group top={paddingTop} left={spaceForAxis}>
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
      </Grid2>
      <Grid2 xs={4}>
        <div className="legends">
          {(props.colorScheme === 'geneexp' || props.colorScheme === 'ZScore') && <UMAPPlotLegend title={props.plottitle}>
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
          </UMAPPlotLegend>}
          <div className="shapelegends">
            <UMAPPlotLegend title="">
              <Legend scale={shapeScale}>
                {(labels) => (
                  <>
                    {labels.map((label, i) => {

                      const shape = shapeScale(label.datum);
                      const isValidElement = React.isValidElement(shape);
                      return (
                        <LegendItem
                          key={`legend-quantile-${i}`}
                          margin="0 4px 0 0"
                          flexDirection="row"

                        >
                          <svg
                            width={legendGlyphSize}
                            height={legendGlyphSize}
                            style={{ margin: "0 5px 2px 0" }}
                          >
                            {isValidElement
                              ? React.cloneElement(shape as React.ReactElement)
                              : React.createElement(
                                shape as React.ComponentType<{ fill: string }>,
                                {
                                  fill: "black",
                                }
                              )}
                          </svg>

                          <LegendLabel align="left" margin={0}>
                            {label.text}
                          </LegendLabel>
                        </LegendItem>
                      );
                    })}
                  </>
                )}
              </Legend>
            </UMAPPlotLegend>
          </div>
          <style jsx>
            {`
              .legends {
                font-family: arial;
                font-weight: 100;
                background-color: white;
                border-radius: 14px;       
                overflow-y: auto;
                flex-grow: 1;
                
              }
              .shapelegends {
                margin-top: 30px;
                font-weight: 100;                
              }
            `}
          </style>
        </div>
      </Grid2>
    </Grid2>
  )
}





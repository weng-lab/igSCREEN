import React, {useMemo} from "react"
import { linearTransform } from "jubilant-carnival";
import { Circle, Line, Polygon } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { MouseEvent } from "react";

export type RnaUmapPoint = {
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

  export const range = (min: number, max: number, by: number = 1) => {
    let newVals: number[] = [];
    for (let i = min; i < max; i = i + by) {
      newVals.push(i);
    }
    return newVals;
  };
  
export const RNAUMAP = (data) => {
    const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } = useTooltip<TooltipData>();
  
    const handleHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: RnaUmapPoint) => {
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
    const handleLeaveHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: RnaUmapPoint) => {
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

      
    
    const xMin: number = Math.min(...data!!.data.map(x => x.umap_1))
    const xMax: number = Math.max(...data!!.data.map(x => x.umap_1))
    const xScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [xMin-0.5, xMax+0.5],
          range: [0, plotWidth], //Start at 20 to provide left side padding to data points
        }),
      [plotWidth, data],
    );
  
    const yMin: number = Math.min(...data.data.map(x => x.umap_2))
    const yMax: number = Math.max(...data.data.map(x => x.umap_2))
      
   
    const yScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [yMin-0.5, yMax+0.5],
          range: [plotHeight, 0]
        }),
      [yMin, yMax, plotHeight],
    );
    
   const maxValue =Math.max(...data!!.data.map(a=>a.value))
      
   const minValue =Math.min(...data!!.data.map(a=>a.value))
    
      
      const gradient = linearTransform(
        { start: 0, end: maxValue },
        { start: 215, end: minValue }
      );
    
      
      return (
        <div>
          <svg width={width+200} height={height}>
            <rect width={width+200} height={height} rx={14} fill="none" stroke="black" />
            <Group top={paddingTop} left={spaceForAxis}>
          <Line stroke="black" opacity={0.3} from={{ x: 0, y: yScale(0) }} to={{ x: plotWidth, y: yScale(0) }} />
          <AxisLeft
            label="UMAP-1"
            labelProps={{fontSize: 14}}
            scale={yScale}

          />
          <AxisBottom
            top ={height-paddingBottom}
            
            label="UMAP-2"
            labelProps={{fontSize: 14}}
            scale={xScale}

          />
          {data!!.data.map(point=>{

            return(  
            <Group key={`datapoint-${point.umap_1}-${point.umap_2}`}>
                {point.stimulation==='S' ?
              <Polygon
                    center={{ x: xScale(point.umap_1), y: yScale(point.umap_2) }}
                    sides={3}
                    size={6}
                    rotate={90}
                    onMouseOver={(event) => handleHover(event, point)}
                    onMouseLeave={(event) => handleLeaveHover(event, point)}                     
                    fill= {`rgb(255,${gradient(point.value).toFixed(0)},0)`}
                  /> :
              <Circle
                    r={5}
                    cx={xScale(point.umap_1)}
                    cy={yScale(point.umap_2)}                    
                    onMouseOver={(event) => handleHover(event, point)}
                    onMouseLeave={(event) => handleLeaveHover(event, point)}                    
                    fill= {`rgb(255,${gradient(point.value).toFixed(0)},0)`}
                  />}

            </Group>)
          })

          }
          </Group>
          <defs>
                        <linearGradient id="scale" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="red" />
                          <stop offset="100%" stop-color="#ffcd00" />
                        </linearGradient>
          </defs>
          <text
                          x={xScale(xMax)+210}
                          y={yScale(yMin)-60}
                                                 
                          fontSize={14}
                          textAnchor="middle"
                        >
                           0
                        </text>
                        <text
                          x={xScale(xMax)+200}
                          y={yScale(yMax)+140}
                                           
                          fontSize={14}
                          textAnchor="middle"
                        >
                           {maxValue.toPrecision(2)}
                        </text>
                        <text
                           x={xScale(xMax)+215}
                           y={yScale(yMin)-30}
                           textAnchor="middle"
                          fontSize={14}
                          
                        >
                           Expression
                        </text>
                  <circle
                  cx={xScale(xMax)+180}
                  cy={yScale(yMin)+25}
                  r={5}
                  />
                        <text
                           x={xScale(xMax)+235}
                           y={yScale(yMin)+30}
                           textAnchor="middle"
                     //    transform="rotate(20)"
                          fontSize={14}
                          
                        >
                           Unstimulated
                        </text>
                        <polygon points={`${xScale(xMax)+175} ${yScale(yMin)+48}, ${xScale(xMax)+185} ${yScale(yMin)+48}, ${xScale(xMax)+180} ${yScale(yMin)+38}`} fill="black" />
                       
                        <text
                           x={xScale(xMax)+228}
                           y={yScale(yMin)+50}
                           textAnchor="middle"
                     //    transform="rotate(20)"
                          fontSize={14}
                          
                        >
                          Stimulated
                        </text>
          <rect
                          x={xScale(xMax)+200}
                          y={yScale(yMax)+150}
                          width={30}
                          height={
                            200
                          }
                          
                          fill="url(#scale)"
                        />
          </svg>
          {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
        >
          <div style={{ maxWidth: "20rem" }}>
            <p><b>Celltype:</b> {tooltipData.celltype}</p>
          </div>
          
          <div>
            <p><b>Name:</b> {tooltipData.name}</p>
          </div>
          <div>
            <p><b>Donor:</b> {tooltipData.donor}</p>
          </div>
          <div>
            <p><b>Class</b> {tooltipData.class}</p>
          </div>
        </TooltipWithBounds>
      )}
      </div>
    )  
}





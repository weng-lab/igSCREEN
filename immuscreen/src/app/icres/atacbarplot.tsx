"use client"
import React from "react"
import { Group } from "@visx/group";
import { BarGroup } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { stringToColour } from './utils';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { COLOR_MAP } from "./consts";

type TooltipData = {
    bardata: { class: string, subclass: string, description: string , ct_description?: string, value: number }
    key: string;
    index: number;
    height: number;
    width: number;
    x: number;
    y: number;
    color: string;
};

const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
};

   
const legendGlyphSize = 15;
  
  
const CellTypesLegends = ({ title, plottitle, children }: { title: string; plottitle?: string; children: React.ReactNode }) => {
    return (
      <div className="legend">
        {plottitle && <div className="maintitle">{plottitle}</div>}
        {plottitle && <br/>}
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
  
  
  
export const AtacBarPlot: React.FC<{plottitle?: string,  byct?: boolean, study: string, barplotdata: { color: string, ct_description?: string, celltype: string, class: string, subclass: string, description: string, order: number, value: number, name: string, study: string, group: string, grouping: string,stimulation: string}[]}> = (props) => {    
    const width = 800
    const height = 700
    const margin =  { top: 40, right: 8, bottom: 40, left: 60 };    
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;   

    function floorToHalf(value) {
      return Math.floor(value * 2) / 2;
    }

    //Find Minimum active value in dataset
    const yMinActive = Math.min(...props.barplotdata?.map((d) => d.value).filter(x => x !== -10))

    //Transform all -10 values to yMinActive - 1 rounded down to nearest whole number
    const transformedData = props.barplotdata?.map(x => x.value === -10 ? {...x, value: floorToHalf(yMinActive - 0.5)} : x)

    const maxVal = Math.max(...transformedData.map((d) => d.value ))

    const xScale = transformedData && scaleBand<string>({
      domain: transformedData.map((d) => d.name),
      round: true,
      range: [0,xMax],
      padding: 0.1   
    });

    const yScale = transformedData &&  scaleLinear<number>({
      domain: [
        floorToHalf(yMinActive - 0.5),
        maxVal + 0.5
      ],
      range:[yMax, 0]
    });

    let ticks: number[] = []
    for (let index = floorToHalf(yMinActive - 0.5); index < (Math.max(...transformedData.map((d) => d.value )) + 0.5); index += 0.5) {
      ticks.push(index);
    }

    const yScaleTickFormat = (v: number, index: number, ticks: { value: number; index: number }[]) =>
    index === 0 ? 'No Signal' : `${v}`
    

    const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =  useTooltip<TooltipData>();
    
    const { containerRef, TooltipInPortal } = useTooltipInPortal({scroll: true});
    

    let uniqcelltypes: string[] =  [...new Set(transformedData.map(c=>c.celltype))] as string[]
    if(props.byct)
    {
        uniqcelltypes =  [...new Set(transformedData.map(c=>COLOR_MAP.get(c.celltype) ? c.celltype : c.description))] as string[]
        
    }
    let ordinalColorScale =  uniqcelltypes && scaleOrdinal({ 
      domain: uniqcelltypes, 
      range: uniqcelltypes.map((c: string)=>COLOR_MAP.get(c) || stringToColour(c) )
    })

    const minTemp = Math.min(...(yScale.domain() as number[]));

    const colorScale = scaleOrdinal<string, string>({
      domain: ['value'],
      range: ["#ff0000"]
    });

    console.log(transformedData)
    return(
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} ref={containerRef}>    
        <Group top={margin.top} left={margin.left}>
          <BarGroup
            data={transformedData}
            keys={['value']}
            height={yMax}
            x0={(d) => d.name}
            x0Scale={xScale}
            x1Scale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barGroups) =>
              barGroups.map((barGroup) => {
                return (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                  left={barGroup.x0}
                >
                  {barGroup.bars.map((bar, i) => (
                    <>
                    <rect
                      key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                      x={bar.x}
                      y={yScale(bar.value > 0 ? bar.value : 0)}
                      width={bar.width}
                      height={Math.abs(
                        yScale( bar.value)   -
                          (bar.value > 0
                            ? yScale(Math.max(0, minTemp))
                            : yScale(0))
                      )}
                      opacity={bar.value === yScale.domain()[0] ? 0.20 : 1}
                      fill={transformedData[barGroup.index].color}
                      rx={4}
                      onMouseLeave={() => {hideTooltip();}}
                      onMouseMove={(event) => {
                        const eventSvgCoords = localPoint(event);
                        const left = barGroup.x0                         
                        showTooltip({
                          tooltipData: {
                            ...bar,
                            bardata: transformedData[barGroup.index]
                          },
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: left,
                        });
                      }}
                      
                    />
                  
                    </>
                  ))}
                </Group>
              )})
            }
          </BarGroup>
          <line
            y1={yScale(0)}
            y2={yScale(0)}
            x1={0}
            x2={xMax}
            stroke="#000000"
          />
          
        </Group>
        <AxisBottom
          left={margin.left}
          top={yMax + margin.top}
          scale={xScale}
          stroke={"#000000"}
          tickStroke={"#000000"}
          hideTicks
          tickComponent={() => null}
          numTicks={transformedData.length}
          tickLabelProps={(value) => { 
            return {
              fill: "#000000",
              fontSize: 11,
              textAnchor: "middle",
              transform: 'rotate(90 ' + xScale(value) + ',50)',
            }
          }}        
        />
        <AxisLeft
          top={margin.top}
          left={margin.left}
          scale={yScale}
          stroke={"#000000"}
          tickStroke={"#000000"}     
          tickLabelProps={{
            fill:"#000000",
            fontSize: 11,
            textAnchor: "end"          
          }}
          tickFormat={yScaleTickFormat}
          tickValues={ticks}
        />
        <Group top={margin.top} left={margin.left}>
          {/* Axis Break */}
          {/* points attribute specifies the coordinates of the vertices of the parallelogram in the format "x1,y1 x2,y2 x3,y3 ...". */}
          {/* The first two pairs of coordinates create the top horizontal line, and the last two pairs create the bottom horizontal line. */}
          <polygon
            points={`-10,${yScale(yScale.domain()[0]) - 25} 10,${yScale(yScale.domain()[0]) - 35} 10,${yScale(yScale.domain()[0]) - 30} -10,${yScale(yScale.domain()[0]) - 20}`}
            fill="#FFFFFF"
          />
          <line
            y2={yScale(yScale.domain()[0]) - 35}
            y1={yScale(yScale.domain()[0]) - 25}
            x1={-10}
            x2={10}
            stroke="#000000"
          />
          <line
            y2={yScale(yScale.domain()[0]) - 30}
            y1={yScale(yScale.domain()[0]) - 20}
            x1={-10}
            x2={10}
            stroke="#000000"
          />
        </Group>
      </svg>
      <div className="legends">    
        <CellTypesLegends title={`${props.study} immune cell types`} plottitle={props.plottitle}>
          <LegendOrdinal  scale={ordinalColorScale} labelFormat={(label) => `${label}`}>
            {(labels) => (
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                {labels.map((label, i) => { 
                  console.log(label)
                  return (                  
                  <LegendItem
                    key={`legend-quantile-${i}`}
                    margin="0 5px"
                  
                  >
                    <svg width={legendGlyphSize} height={legendGlyphSize}>
                      <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px" color={"#ff0000"}>
                      <text className={"labelcolor"}>
                        {transformedData.find(b => b.celltype === label.text)?.ct_description || (transformedData.find(b => b.celltype === label.text) ? transformedData.find(b => b.celltype === label.text).description : label.text)}
                      </text>
                    </LegendLabel>
                  </LegendItem>
                  
                )} )}
              </div>
            )}
          </LegendOrdinal>
        </CellTypesLegends>
        <style>
            {`
            .legends {
              display: flex;
              font-family: arial;
              font-weight: 900;        
              border-radius: 14px;        
              margin-left: 50px;        
              
            }
            .labelcolor {
              color:   #000000;
            }
          `}
        </style>
      </div>  
      {tooltipOpen && tooltipData && (
          <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div style={{ color: colorScale(tooltipData.key) }}>
              <strong>{tooltipData.bardata.description.toString().replace('"','')}</strong>
            </div>
            <br/>
            <div>{"Cell Type: "+(tooltipData.bardata.ct_description || tooltipData.bardata.description)}</div>
            <div>{"Class: "+tooltipData.bardata.class}</div>
            <div>{"SubClass: "+tooltipData.bardata.subclass}</div>
            <div>{tooltipData.bardata.value === yScale.domain()[0] ? "No Signal" : tooltipData.bardata.value.toFixed(2)}</div>
        </TooltipInPortal>
      )}  
    </div>
    )
}
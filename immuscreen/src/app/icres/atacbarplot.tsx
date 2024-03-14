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
  

    const xScale = props && props.barplotdata && scaleBand<string>({
      domain: props.barplotdata.map((d) => d.name),
      round: true,
      range: [0,xMax]    
    });

    const yScale = props && props.barplotdata &&  scaleLinear<number>({
      domain: [
        Math.min(
          ...props.barplotdata.map((d) => d.value)
        ) - 0.5,
        Math.max(...props.barplotdata.map((d) => d.value )) + 0.5
      ],
      range:[yMax, 0]

    });
    

    const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =  useTooltip<TooltipData>();
    
    const { containerRef, TooltipInPortal } = useTooltipInPortal({scroll: true});
    

    let uniqcelltypes: string[] =  [...new Set(props.barplotdata.map(c=>c.celltype))] as string[]
    if(props.byct)
    {
        uniqcelltypes =  [...new Set(props.barplotdata.map(c=>COLOR_MAP.get(c.celltype) ? c.celltype : c.description))] as string[]
        
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

   
    return(
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} ref={containerRef}>    
        <Group top={margin.top} left={margin.left}>
          <BarGroup
            data={props.barplotdata}
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
                  {barGroup.bars.map((bar) => (
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
                      fill={props.barplotdata[barGroup.index].color}
                      rx={4}
                      onMouseLeave={() => {hideTooltip();}}
                      onMouseMove={(event) => {
                        const eventSvgCoords = localPoint(event);
                        const left = barGroup.x0                         
                        showTooltip({
                          tooltipData: {
                            ...bar,
                            bardata: props.barplotdata[barGroup.index]
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
          numTicks={props.barplotdata.length}
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
        />
      </svg>
      <div className="legends">    
        <CellTypesLegends title={`${props.study} immune cell types`} plottitle={props.plottitle}>
          <LegendOrdinal  scale={ordinalColorScale} labelFormat={(label) => `${label}`}>
            {(labels) => (
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                {labels.map((label, i) => { 
                    
                  return (                  
                  <LegendItem
                    key={`legend-quantile-${i}`}
                    margin="0 5px"
                  
                  >
                    <svg width={legendGlyphSize} height={legendGlyphSize}>
                      <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px" color={"#ff0000"}>
                      <span className={"labelcolor"}>{props.barplotdata.find(b=>b.celltype===label.text)?.ct_description || (props.barplotdata.find(b=>b.celltype===label.text) ? props.barplotdata.find(b=>b.celltype===label.text).description : label.text)}</span>
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
            
            <div>{tooltipData.bardata.value.toFixed(2)}</div>
        </TooltipInPortal>
      )}  
    </div>
    )
}
import React, { useMemo } from 'react';
import { Bar, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Text } from '@visx/text'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid';
import { JoinFull } from '@mui/icons-material';
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';

export type BarsProps = {
  width: number;
  height: number;
  data: { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] }
  setCursor: React.Dispatch<React.SetStateAction<"auto" | "pointer" | "cell" | "not-allowed">>
  handleDownload: (downloadKey: string) => Promise<void>
  loading?: boolean
};

interface TooltipData {
  message: string,
  count: number
}

export default function UpSetPlot({ width, height, data, setCursor, handleDownload, loading = false }: BarsProps) {

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } = useTooltip<TooltipData>();

  const intersectionData = data.intersections.sort((a, b) => b.count - a.count)
  const setSizeData = data.counts.sort((a, b) => {
    const indexA = data.order.findIndex((x) => x === a.name)
    const indexB = data.order.findIndex((x) => x === b.name)
    if (indexA === -1 || indexB === -1) {
      throw new Error("Couldn't match given ordered cell names to individual counts, check cell names in order and counts")
    }
    return (indexA - indexB)
  })

  const fontSize = 14
  let intersectionCountsFontSize = 14;

  // end dimensions of the plot
  const totalWidth = width
  const totalHeight = height

  let setSizePlotTotalWidth: number;
  switch (data.counts.length) {
    case (1): setSizePlotTotalWidth = totalWidth * 0.45; break;
    case (2): setSizePlotTotalWidth = totalWidth * 0.45; break;
    case (3): setSizePlotTotalWidth = totalWidth * 0.45; break;
    case (4): setSizePlotTotalWidth = totalWidth * 0.375; break;
    case (5): setSizePlotTotalWidth = totalWidth * 0.325; break;
    case (6): setSizePlotTotalWidth = totalWidth * 0.275; intersectionCountsFontSize = 7; break;
  }
  const spaceForCellName = 100
  const spaceForCellCounts = 80
  const setSizePlotBarsWidth = setSizePlotTotalWidth - spaceForCellName - spaceForCellCounts
  const spaceForTextRight = 15
  const intersectionPlotWidth = totalWidth - setSizePlotTotalWidth - spaceForTextRight

  // Intersection plot width scale based on width available to it
  const intersectionPlotWidthScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, intersectionPlotWidth],
        round: true,
        domain: intersectionData.map((x) => x.name),
        padding: 0.4,
      }),
    [intersectionPlotWidth, intersectionData],
  );

  const spaceForBottomAxis = 40
  const setSizePlotBarsHeight = fontSize * 1.5 * data.counts.length

  const setSizePlotTotalHeight = setSizePlotBarsHeight + spaceForBottomAxis
  const spaceForTextTop = 60
  const intersectionPlotBarsHeight = totalHeight - setSizePlotTotalHeight - spaceForTextTop
  const intersectionPlotTotalHeight = intersectionPlotBarsHeight + spaceForTextTop

  const intersectionPlotHeightScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [intersectionPlotBarsHeight, 0],
        round: true,
        domain: [0, Math.max(...intersectionData.map(x => x.count))],
      }),
    [intersectionPlotBarsHeight, intersectionData],
  );

  const setSizePlotWidthScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [setSizePlotBarsWidth, 0],
        round: true,
        domain: [0, Math.max(...setSizeData.map(x => x.count))],
      }),
    [setSizePlotBarsWidth, setSizeData],
  )

  const setSizePlotHeightScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, setSizePlotBarsHeight],
        round: true,
        domain: setSizeData.map((x) => x.name),
        paddingInner: 0.4,
        paddingOuter: 0.2
      }),
    [setSizePlotBarsHeight, setSizeData],
  );

  return totalWidth < 10 ? null : (
    <div>
      <svg fontSize={fontSize} id='UpSet-Plot' width={totalWidth} height={totalHeight}>
        <rect width={totalWidth} height={totalHeight} fill='none' stroke='black' fillOpacity={0.5} rx={14} />
        <Group
          top={30}
          left={30}
          onClick={() => handleDownload("Union_All")}
          onMouseMove={(event) => {
            setCursor("pointer")
            showTooltip({
              tooltipTop: event.pageY,
              tooltipLeft: event.pageX,
              tooltipData: {
                message: "Total Union Size",
                count: data.intersections.map((x) => x.count).reduce((accumulator, element) => accumulator + element, 0)
              }
            })
          }}
          onMouseLeave={() => {
            setCursor("auto")
            hideTooltip()
          }}
        >
          <JoinFull inheritViewBox />
          <text>
            <tspan x={25} y={17}>
              Total Union Size:
            </tspan>
            <tspan x={25} y={17} dy={16}>
              {data.intersections.map((x) => x.count).reduce((accumulator, element) => accumulator + element, 0)}
            </tspan>
          </text>
        </Group>
        {loading &&
          <Group
            top={25}
            left={totalWidth - 10}
          >
            <Text textAnchor='end'>Downloading...</Text>
          </Group>
        }
        {/* The set size plot */}
        <Group left={0} top={intersectionPlotTotalHeight}>
          <AxisBottom left={spaceForCellCounts} top={setSizePlotBarsHeight} scale={setSizePlotWidthScale} label='Set Size' tickValues={[0, 100000]} />
          <GridColumns left={spaceForCellCounts} top={0} scale={setSizePlotWidthScale} height={setSizePlotBarsHeight} tickValues={[0, 100000]} stroke="#e0e0e0" />
          {setSizeData.map((d, i) => {
            const barWidth = setSizePlotBarsWidth - (setSizePlotWidthScale(d.count) ?? 0);
            const barHeight = setSizePlotHeightScale.bandwidth();
            const barX = (setSizePlotWidthScale(d.count) ?? 0) + spaceForCellCounts;
            const barY = setSizePlotHeightScale(d.name);
            return (
              <Group key={`Group-${d.name}`}>
                {/* Shading bar */}
                {i % 2 === 1 &&
                  <Bar
                    y={barY - (0.5 * ((1 - setSizePlotHeightScale.padding()) * barHeight))}
                    x={spaceForTextRight}
                    width={totalWidth - 2 * spaceForTextRight}
                    height={barHeight + ((1 - setSizePlotHeightScale.padding()) * barHeight)}
                    fill="#eeeeee"
                  />
                }
                <Group
                  onClick={() => handleDownload(d.name)}
                  onMouseMove={(event) => {
                    setCursor("pointer")
                    showTooltip({
                      tooltipTop: event.pageY,
                      tooltipLeft: event.pageX,
                      tooltipData: {
                        message: d.name,
                        count: d.count
                      }
                    })
                  }}
                  onMouseLeave={() => {
                    setCursor("auto")
                    hideTooltip()
                  }}
                >
                  <Text textAnchor='end' verticalAnchor='middle' x={barX} dx={-4} y={barY} dy={0.5 * barHeight}>
                    {d.count}
                  </Text>
                  <Bar
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill="black"
                    onClick={() => handleDownload(d.name)}
                    onMouseEnter={() => setCursor("pointer")}
                    onMouseLeave={() => setCursor("auto")}
                  />
                  <Text textAnchor='end' verticalAnchor='middle' x={setSizePlotTotalWidth} y={barY} dy={0.5 * barHeight}>
                    {d.name.length > 12 ? d.name.substring(0, 9).replaceAll('_', ' ') + '...' : d.name.replaceAll('_', ' ')}
                  </Text>
                  {/* this expands clickable area for download */}
                  <rect x={spaceForTextRight} y={barY} width={setSizePlotTotalWidth} height={barHeight} fill="rgba(0, 255, 0, 0)" />
                </Group>
              </Group>
            );
          })}
        </Group>
        {/* The intersection plot and circles */}
        <Group left={setSizePlotTotalWidth} top={spaceForTextTop}>
          <AxisLeft label='Intersection Size' scale={intersectionPlotHeightScale} />
          <GridRows scale={intersectionPlotHeightScale} width={intersectionPlotWidth} height={intersectionPlotBarsHeight} stroke="#e0e0e0" />
          {intersectionData.map((d) => {
            const barWidth = intersectionPlotWidthScale.bandwidth();
            const barHeight = intersectionPlotBarsHeight - (intersectionPlotHeightScale(d.count) ?? 0);
            const barX = intersectionPlotWidthScale(d.name);
            const barY = (intersectionPlotHeightScale(d.count) ?? 0);
            const halfBarWidth = barWidth / 2
            const circleRadius = Math.min(halfBarWidth, fontSize * 0.6)
            console.log(circleRadius)
            const connectingBarWidth = circleRadius / 3
            return (
              <Group
                key={`Group-${d.name}`}
                onClick={() => handleDownload(d.name)}
                onMouseMove={(event) => {
                  setCursor("pointer")
                  let intersecting: string[] = []
                  let excluding: string[] = []
                  for (let i = 0; i < d.name.length; i++) {
                    let char = d.name.charAt(i);
                    char === "1" ? intersecting.push(data.order[i]) : excluding.push(data.order[i])
                  }
                  showTooltip({
                    tooltipTop: event.pageY,
                    tooltipLeft: event.pageX,
                    tooltipData: {
                      message: `${"Intersecting " + intersecting.join(', ')} ${excluding.length > 0 ? " Exluding " + excluding.join(', ') : ''}`,
                      count: d.count
                    }
                  })
                }}
                onMouseLeave={() => {
                  setCursor("auto")
                  hideTooltip()
                }}
              >

                <Group>
                  <Text x={barX + (halfBarWidth)} y={barY - 5} angle={315} fontSize={intersectionCountsFontSize}>
                    {d.count}
                  </Text>
                  <Bar
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill="black"
                  />
                </Group>
                {/* this expands clickable area for download */}
                <rect x={barX} y={barY} width={barWidth} height={barHeight + setSizePlotBarsHeight} fill="rgba(255, 0, 0, 0)" />
                {Array.from(d.name).map((char, index) => (
                  <Circle
                    key={`circle-${index}`}
                    cx={barX + halfBarWidth}
                    cy={intersectionPlotBarsHeight + (index * fontSize * 1.5) + (0.5 * fontSize * 1.5)}
                    r={circleRadius}
                    fill={char === '1' ? '#000000' : '#bbbbbb'}
                  />
                ))}
                {/* If intersecting multiple cells, generate bar between first and last filled in circles */}
                {d.name.indexOf('1') !== d.name.lastIndexOf('1') && d.name.indexOf('1') !== -1 &&
                  <Bar
                    x={barX + (halfBarWidth) - (connectingBarWidth / 2)}
                    //Set to begin at first intersection
                    y={intersectionPlotBarsHeight + (d.name.indexOf('1') * 1.5 * fontSize) + (0.5 * 1.5 * fontSize)}
                    width={connectingBarWidth}
                    //height set to reach last intersection
                    height={(1.5 * fontSize) * (d.name.lastIndexOf('1') - d.name.indexOf('1'))}
                    fill='black'
                  />
                }
              </Group>
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
        >
          <div>
            <p>{tooltipData.message}</p>
          </div>
          <div>
            <p>Count: {tooltipData.count}</p>
          </div>
          <div>
            <p>Click to download set (.BED)</p>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
}
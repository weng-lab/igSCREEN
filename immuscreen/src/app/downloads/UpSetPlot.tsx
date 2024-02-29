import React, { useMemo } from 'react';
import { Bar, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Text } from '@visx/text'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid';


export type BarsProps = {
  width: number;
  height: number;
  data: { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] }
  setCursor:  React.Dispatch<React.SetStateAction<"auto" | "pointer" | "cell" | "not-allowed">>
  events?: boolean;
};

export default function UpSetPlot({ width, height, data, setCursor, events = false }: BarsProps) {
  const intersectionData = data.intersections.sort((a, b) => b.count - a.count)
  const setSizeData = data.counts.sort((a, b) => {
    const indexA = data.order.findIndex((x) => x === a.name)
    const indexB = data.order.findIndex((x) => x === b.name)
    if (indexA === -1 || indexB === -1) {
      throw new Error("Couldn't match given ordered cell names to individual counts, check cell names in order and counts")
    }
    return (indexA - indexB)
  })

  // end dimensions of the plot
  const totalWidth = width
  const totalHeight = height

  // based on total dimensions set widths of intersection and set size charts
  const setSizePlotTotalWidth = totalWidth * 0.35
  const spaceForCellName = 120
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
  //convoluted, but calculates the needed height based on how much room is taken up by the circles
  const setSizePlotBarsHeight = (((intersectionPlotWidthScale.bandwidth() * 1.5) * (intersectionData[0].name.length)) + (intersectionPlotWidthScale.bandwidth() * 0.5))
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
        padding: 0.4,
      }),
    [setSizePlotBarsHeight, setSizeData],
  );

  return totalWidth < 10 ? null : (
    <svg id='UpSet-Plot' width={totalWidth} height={totalHeight}>
      <rect width={totalWidth} height={totalHeight} fill='none' stroke='black' fillOpacity={0.5} rx={14} />
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
              {i % 2 === 1 &&
                <Bar
                  y={barY - (0.5 * ((1 - setSizePlotHeightScale.padding()) * barHeight))}
                  x={spaceForTextRight}
                  width={totalWidth - 2 * spaceForTextRight}
                  height={barHeight + ((1 - setSizePlotHeightScale.padding()) * barHeight)}
                  fill="#eeeeee"
                />
              }
              <Text textAnchor='end' x={barX} dx={-4} y={barY} dy={15} angle={0}>
                {d.count}
              </Text>
              <Bar
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="black"
                onClick={() => {
                  if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                }}
                onMouseEnter={() => setCursor("pointer")}
                onMouseLeave={() => setCursor("auto")}
              />
              <Text textAnchor='end' x={setSizePlotTotalWidth} y={barY} dy={15} angle={0}>
                {d.name.length > 13 ? d.name.substring(0, 10).replaceAll('_', ' ') + '...' : d.name.replaceAll('_', ' ')}
              </Text>
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
          const circleRadius = halfBarWidth
          const connectingBarWidth = barWidth / 8
          return (
            <Group key={`Group-${d.name}`}>
              <Text x={barX + (halfBarWidth)} y={barY - 5} angle={315}>
                {d.count}
              </Text>
              <Bar
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="black"
                onClick={() => {
                  if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                }}
                onMouseEnter={() => setCursor("pointer")}
                onMouseLeave={() => setCursor("auto")}
              />
              {Array.from(d.name).map((char, index) => (
                <Circle
                  key={`circle-${index}`}
                  cx={barX + (circleRadius)}
                  // intersectionPlotHeight is bottom of bar. Move first circle down by one diameter (such that gap is r). Each circle after the first is bumped down by 3 r such that the gap is 1 r
                  cy={intersectionPlotBarsHeight + (2 * circleRadius) + (index * (3 * circleRadius))}
                  r={circleRadius}
                  fill={char === '1' ? '#000000' : '#bbbbbb'}
                />
              ))}
              {/* If intersecting multiple cells, generate bar between first and last filled in circles */}
              {d.name.indexOf('1') !== d.name.lastIndexOf('1') && d.name.indexOf('1') !== -1 &&
                <Bar
                  x={barX + (halfBarWidth) - (connectingBarWidth / 2)}
                  y={intersectionPlotBarsHeight + (2 * circleRadius) + (d.name.indexOf('1') * (3 * circleRadius))}
                  width={connectingBarWidth}
                  height={(3 * circleRadius) * (d.name.lastIndexOf('1') - d.name.indexOf('1'))}
                  fill='black'
                />
              }
            </Group>
          );
        })}
      </Group>
    </svg>
  );
}
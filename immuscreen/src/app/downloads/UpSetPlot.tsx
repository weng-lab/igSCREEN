import React, { useMemo } from 'react';
import { Bar, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Text } from '@visx/text'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid';

const mockData = {
  intersections: [
    {
      name: '0001',
      count: 6757
    },
    {
      name: '0010',
      count: 11042
    },
    {
      name: '0011',
      count: 1774
    },
    {
      name: '0100',
      count: 14610
    },
    {
      name: '0101',
      count: 9168
    },
    {
      name: '0110',
      count: 5173
    },
    {
      name: '0111',
      count: 21110
    },
    {
      name: '1000',
      count: 76161
    },
    {
      name: '1001',
      count: 1740
    },
    {
      name: '1010',
      count: 5847
    },
    {
      name: '1011',
      count: 1758
    },
    {
      name: '1100',
      count: 5464
    },
    {
      name: '1101',
      count: 4348
    },
    {
      name: '1110',
      count: 4296
    },
    {
      name: '1111',
      count: 73969
    },
  ],
  counts: [
    {
      name: 'All',
      count: 243217
    },
    {
      name: 'HSC',
      count: 173583
    },
    {
      name: 'Bulk_B-U',
      count: 138138
    },
    {
      name: 'Bulk_B-S',
      count: 124969
    },
    {
      name: 'Naive_B-U',
      count: 120624
    },
  ],
  order: ['HSC', 'Bulk_B-U', 'Bulk_B-S', 'Naive_B-U']
}


export type BarsProps = {
  width: number;
  height: number;
  data?: {intersections: {name: string, count: number}[], counts: {name: string, count: number}[], order: string[]}
  events?: boolean;
};

export default function UpSetPlot({ width, height, data = mockData, events = false }: BarsProps) {
  const sortedData = data.intersections.sort((a, b) => b.count - a.count)
  
  // end dimensions of the plot
  const totalWidth = width
  const totalHeight = height

  //based on total dimensions set widths of intersection and set size charts
  const setSizePlotWidth = totalWidth * 0.3
  const spaceForTextRight = 15
  const intersectionPlotWidth = totalWidth - setSizePlotWidth - spaceForTextRight

  //Intersection plot width scale based on width available to it
  const intersectionPlotWidthScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, intersectionPlotWidth],
        round: true,
        domain: sortedData.map((x) => x.name),
        padding: 0.4,
      }),
    [intersectionPlotWidth, sortedData],
  );

  // calculate amount of vertical space needed by the set size/circles chart, set height of intersection plot to be what's left
  const setSizePlotHeight = intersectionPlotWidthScale.bandwidth() * 1.5 * sortedData[0].name.length //Circle diameter = intersectionPlotWidthScale.bandwidth(). Height = diameter * 1.5 * number of sets
  const spaceForTextTop = 60
  const intersectionPlotHeight = totalHeight - setSizePlotHeight - spaceForTextTop

  const intersectionPlotHeightScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [intersectionPlotHeight, 0],
        round: true,
        domain: [0, Math.max(...sortedData.map(x => x.count))],
      }),
    [intersectionPlotHeight, sortedData],
  );
  
  //Probably need two more scales here for other bar plot

  return totalWidth < 10 ? null : (
    <svg id='UpSet-Plot' width={totalWidth} height={totalHeight}>
      <rect width={totalWidth} height={totalHeight} fill='none' stroke='black' fillOpacity={0.5} rx={14} />
      {/* Is 50 a good number in all scenarios */}
      <Group left={setSizePlotWidth} top={spaceForTextTop}>
        <AxisLeft scale={intersectionPlotHeightScale} />
        <GridRows scale={intersectionPlotHeightScale} width={intersectionPlotWidth} height={intersectionPlotHeight} stroke="#e0e0e0" />
        {sortedData.map((d) => {
          const barWidth = intersectionPlotWidthScale.bandwidth();
          const barHeight = intersectionPlotHeight - (intersectionPlotHeightScale(d.count) ?? 0);
          const barX = intersectionPlotWidthScale(d.name);
          const barY = intersectionPlotHeight - barHeight;
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
              />
              {Array.from(d.name).map((char, index) => (
                <Circle
                  key={`circle-${index}`}
                  cx={barX + (circleRadius)}
                  // intersectionPlotHeight is bottom of bars, add 1/2 radius gap. Each circle after the first is bumped down by 3 radii
                  cy={intersectionPlotHeight + (0.5 * circleRadius) + (circleRadius) + (index * (3 * circleRadius))}
                  r={circleRadius}
                  fill={char ==='1' ? 'black': 'lightgray'}
                />
              ))}
              {/* If intersecting multiple cells, generate bar between first and last filled in circles */}
              {d.name.indexOf('1') !== d.name.lastIndexOf('1') && d.name.indexOf('1') !== -1 &&
                <Bar
                  x={barX + (halfBarWidth) - (connectingBarWidth / 2)}
                  y={intersectionPlotHeight + (0.5 * circleRadius) + (circleRadius) + (d.name.indexOf('1') * (3 * circleRadius))}
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
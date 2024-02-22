import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';

const verticalMargin = 120;


export type BarsProps = {
  width: number;
  height: number;
  //Is order of array for sure preserved when passed? Critical for aligning results with cell names
  data: {name: string, count: number, color?: string}[]
  events?: boolean;
};

export default function UpSetPlot({ width, height, data, events = false }: BarsProps) {
  const sortedData = data.sort((a, b) => b.count - a.count)
  
  // bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: sortedData.map((x) => x.name),
        padding: 0.4,
      }),
    [xMax, sortedData],
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...sortedData.map(x => x.count))],
      }),
    [yMax, sortedData],
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      {/* <GradientTealBlue id="teal" /> */}
      <rect width={width} height={height} fill='lightgrey' fillOpacity={0.5} rx={14} />
      <Group top={verticalMargin / 2}>
        {sortedData.map((d) => {
          const letter = d.name;
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(d.count) ?? 0);
          const barX = xScale(letter);
          const barY = yMax - barHeight;
          return (
            <Bar
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="black"
              onClick={() => {
                if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
              }}
            />
          );
        })}
      </Group>
    </svg>
  );
}
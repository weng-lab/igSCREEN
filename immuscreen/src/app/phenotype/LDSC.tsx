import { Circle, Line } from "@visx/shape";
import { LDSCDataPoint } from "./page";
import { AxisLeft } from "@visx/axis";
import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { experimentInfo, newColors } from "../icres/consts"
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';

type Props = {
  width: number;
  height: number;
  data: LDSCDataPoint[];
  pValCutoff: number;
  stimView: "S" | "U" | "B"
};

interface TooltipData {
  cell: string,
  enrichment: number,
  enrichmentP: number,
  percentageSNPs: number,
}

export default function LDSCplot({ width, height, data, pValCutoff, stimView }: Props) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } = useTooltip<TooltipData>();

  const dataMin: number = Math.min(...data.map(x => x.enrichment))
  const dataMax: number = Math.max(...data.map(x => x.enrichment))

  const orderedData = [... data]
    .sort((a, b) => {
      if (experimentInfo[a.celltype] && experimentInfo[b.celltype]) {
        return (experimentInfo[a.celltype].order - experimentInfo[b.celltype].order)
      } else {
        console.log("Couldn't find" + a.celltype + "or" + b.celltype)
        return 0
      }
    })
    // .filter(x => x.enrichment_p < pValCutoff)

  const spaceForAxis = 60
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 20
  const plotWidth = width - spaceForAxis - paddingRight
  const plotHeight = height - paddingTop - paddingBottom

  //Input to this will be the order of the celltype according to known order. Output is its position on the x axis
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, data.length],
        range: [0, plotWidth],
      }),
    [plotWidth, data],
  );

  //Input to this is the enrichment value of a point. Output is its vertical position on the scale
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [dataMin, dataMax],
        range: [plotHeight, 0]
      }),
    [dataMin, dataMax, plotHeight],
  );

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} rx={14} fill="none" stroke="black" />
        <Group top={paddingTop} left={spaceForAxis}>
          <Line stroke="black" from={{ x: 0, y: yScale(0) }} to={{ x: plotWidth, y: yScale(0) }} />
          <AxisLeft
            label="Heritability Enrichment"
            scale={yScale}
          />
          {orderedData.map((point, i) => {
            const stimulated = point.celltype.split("-")[point.celltype.split("-").length - 1] === "S"
            return (
              point.enrichment_p <= pValCutoff && (stimView === "S" && stimulated || stimView === "U" && !stimulated || stimView === "B") ?
                <Circle
                  key={`${point.study}-${i}`}
                  stroke={stimulated ? "black" : "none"}
                  strokeWidth={1.5}
                  r={5}
                  cx={xScale(i)}
                  cy={yScale(point.enrichment)}
                  fill={newColors[point.celltype.split('-')[1]] || "black"}
                  onMouseMove={(event) => {
                    showTooltip({
                      tooltipTop: event.pageY,
                      tooltipLeft: event.pageX,
                      tooltipData: {
                        cell: experimentInfo[point.celltype].description,
                        enrichment: point.enrichment,
                        enrichmentP: point.enrichment_p,
                        percentageSNPs: point.snps
                      }
                    })
                  }}
                  onMouseLeave={() => {
                    hideTooltip()
                  }}
                />
                :
                <Circle
                  key={`${point.study}-${i}`}
                  r={5}
                  cx={xScale(i)}
                  cy={yScale(point.enrichment)}
                  opacity={0.1}
                  fill={newColors[point.celltype.split('-')[1]] || "black"}
                />
            )
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
        >
          <div style={{maxWidth: "20rem"}}>
            <p><b>Cell:</b> {tooltipData.cell}</p>
          </div>
          <br />
          <div>
            <p><b>Enrichment:</b> {tooltipData.enrichment.toFixed(2)}</p>
          </div>
          <div>
            <p><b>Enrichment p-value:</b> {tooltipData.enrichmentP.toPrecision(2)}</p>
          </div>
          <div>
            <p><b>Percentage of SNPs:</b> {tooltipData.percentageSNPs.toPrecision(2)}</p>
          </div>
        </TooltipWithBounds>
      )}
    </div>

  )

}
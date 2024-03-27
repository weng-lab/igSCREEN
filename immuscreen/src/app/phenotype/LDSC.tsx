import { Circle, Line, Polygon } from "@visx/shape";
import { LDSCDataPoint } from "./page";
import { AxisLeft } from "@visx/axis";
import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { experimentInfo, cellColors } from "../icres/consts"
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
  enrichmentStdErr: number,
  percentageSNPs: number,
}

export default function LDSCplot({ width, height, data, pValCutoff, stimView }: Props) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } = useTooltip<TooltipData>();

  const dataMin: number = Math.min(...data.map(x => x.enrichment))
  const dataMax: number = Math.max(...data.map(x => x.enrichment))

  const orderedData = [...data]
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
  const dataPaddingLeft = 20
  const dataPaddingTopBottom = 15

  //Input to this will be the order of the celltype according to known order. Output is its position on the x axis
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, data.length],
        range: [dataPaddingLeft, plotWidth], //Start at 20 to provide left side padding to data points
      }),
    [plotWidth, data],
  );

  //Input to this is the enrichment value of a point. Output is its vertical position on the scale
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [dataMin - dataPaddingTopBottom, dataMax + dataPaddingTopBottom],
        range: [plotHeight, 0]
      }),
    [dataMin, dataMax, plotHeight],
  );

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} rx={14} fill="none" stroke="black" />
        <Group top={paddingTop} left={spaceForAxis}>
          <Line stroke="black" opacity={0.3} from={{ x: 0, y: yScale(0) }} to={{ x: plotWidth, y: yScale(0) }} />
          <AxisLeft
            label="Heritability Enrichment"
            scale={yScale}
          />
          {orderedData.map((point, i) => {
            const stimulated = point.celltype.split("-")[point.celltype.split("-").length - 1] === "S"
            const toBeShown = point.enrichment_p <= pValCutoff && (stimView === "S" && stimulated || stimView === "U" && !stimulated || stimView === "B")

            if (stimulated) { //If stimulated, represent as diamond
              return (
                <Polygon
                  key={`${point.study}-${i}`}
                  center={{x: xScale(i), y: yScale(point.enrichment)}}
                  sides={4}
                  size={6}
                  opacity={toBeShown ? 1 : 0.1} //Sharply decrease opacity if not to be shown
                  fill={cellColors[point.celltype.split('-')[1]] || "black"}
                  rotate={0}
                  onMouseMove={(event) => {
                    toBeShown && showTooltip({
                      tooltipTop: event.pageY,
                      tooltipLeft: event.pageX,
                      tooltipData: {
                        cell: experimentInfo[point.celltype].description,
                        enrichment: point.enrichment,
                        enrichmentP: point.enrichment_p,
                        enrichmentStdErr: point.enrichment_std_error,
                        percentageSNPs: point.snps
                      }
                    })
                  }}
                  onMouseLeave={() => {
                    toBeShown && hideTooltip()
                  }}
                />
              )
            } else { //If unstimulated, represent as circle
              return (
                <Circle
                  key={`${point.study}-${i}`}
                  r={5}
                  opacity={toBeShown ? 1 : 0.1} //Sharply decrease opacity if not to be shown
                  cx={xScale(i)}
                  cy={yScale(point.enrichment)}
                  fill={cellColors[point.celltype.split('-')[1]] || "black"}
                  onMouseMove={(event) => {
                    toBeShown && showTooltip({
                      tooltipTop: event.pageY,
                      tooltipLeft: event.pageX,
                      tooltipData: {
                        cell: experimentInfo[point.celltype].description,
                        enrichment: point.enrichment,
                        enrichmentP: point.enrichment_p,
                        enrichmentStdErr: point.enrichment_std_error,
                        percentageSNPs: point.snps
                      }
                    })
                  }}
                  onMouseLeave={() => {
                    toBeShown && hideTooltip()
                  }}
                />
              )
            }
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
            <p><b>Enrichment Std Error:</b> {tooltipData.enrichmentStdErr.toPrecision(2)}</p>
          </div>
          <div>
            <p><b>Percentage of SNPs:</b> {tooltipData.percentageSNPs.toPrecision(2)}</p>
          </div>
        </TooltipWithBounds>
      )}
    </div>

  )

}
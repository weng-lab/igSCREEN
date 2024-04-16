import { Circle, Line, Polygon } from "@visx/shape";
import { LDSCDataPoint } from "./page";
import { AxisLeft } from "@visx/axis";
import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { experimentInfo, cellTypeStaticInfo } from "../../common/consts"
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { Text } from '@visx/text';
import { MouseEvent } from "react";
import { getCellColor } from "../celllineage/utils";
import { CellName, CellQueryValue } from "../celllineage/types";

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

  const handleHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: LDSCDataPoint) => {
    showTooltip({
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
    event.currentTarget.setAttribute("stroke", "black") //Outline point
    event.currentTarget.setAttribute("transform", "scale(1.5)") //Grow point
    document.getElementById(`stdErr-${point.celltype}`).setAttribute("stroke", "black") //Show std error bars
  }

  const handleLeaveHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: LDSCDataPoint) => {
    hideTooltip()
    event.currentTarget.setAttribute("stroke", "none")
    event.currentTarget.setAttribute("transform", "scale(1)")
    document.getElementById(`stdErr-${point.celltype}`).setAttribute("stroke", "none")
  }

  const orderedData = [...data]
    .sort((a, b) => {
      if (experimentInfo[a.celltype] && experimentInfo[b.celltype]) {
        return (experimentInfo[a.celltype].order - experimentInfo[b.celltype].order)
      } else {
        console.log("Couldn't find" + a.celltype + "or" + b.celltype)
        return 0
      }
    })

  const spaceForAxis = 70
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

  const dataMin: number = Math.min(...data.map(x => x.enrichment))
  const dataMax: number = Math.max(...data.map(x => x.enrichment))

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
            labelProps={{fontSize: 14}}
            scale={yScale}
            
          />
          {orderedData.map((point, i) => {
            const stimulated = point.celltype.split("-")[point.celltype.split("-").length - 1] === "S"
            // Passes p-val cutoff and is correct stimulation
            const toBeShown = point.enrichment_p <= pValCutoff && (stimView === "S" && stimulated || stimView === "U" && !stimulated || stimView === "B")
            const commonProps = {
              opacity: toBeShown ? 1 : 0.1, //Sharply decrease opacity if not to be shown
              fill: getCellColor(point.celltype.split('-')[1] as CellQueryValue | CellName),
              style: { transformOrigin: `${xScale(i)}px ${yScale(point.enrichment)}px` }, //Needed so that scale transforms are applied correctly
              onMouseMove: (event) => handleHover(event, point),
              onMouseLeave: (event) => handleLeaveHover(event, point)
            }

            return (
              <Group key={`datapoint-${point.celltype}`}>
                {/* Standard error */}
                <Group id={`stdErr-${point.celltype}`}>
                  <Line
                    from={{ x: xScale(i), y: yScale(point.enrichment - point.enrichment_std_error) }}
                    to={{ x: xScale(i), y: yScale(point.enrichment + point.enrichment_std_error) }}
                  />
                  <Line
                    from={{ x: xScale(i - 2), y: yScale(point.enrichment - point.enrichment_std_error) }}
                    to={{ x: xScale(i + 2), y: yScale(point.enrichment - point.enrichment_std_error) }}
                  />
                  <Line
                    from={{ x: xScale(i - 2), y: yScale(point.enrichment + point.enrichment_std_error) }}
                    to={{ x: xScale(i + 2), y: yScale(point.enrichment + point.enrichment_std_error) }}
                  />
                </Group>
                {/* Datapoint */}
                {stimulated ?
                  <Polygon
                    center={{ x: xScale(i), y: yScale(point.enrichment) }}
                    sides={3}
                    size={6}
                    rotate={90}
                    {...commonProps}
                  />
                  :
                  <Circle
                    r={5}
                    cx={xScale(i)}
                    cy={yScale(point.enrichment)}
                    {...commonProps}
                  />
                }
              </Group>
            )
          })}
        </Group>
        <Text x={width - 10} y={20} textAnchor="end" fontSize={12}>* Colors represent cell type, hovering shows standard error</Text>
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
            <p><b>Enrichment Std Error:</b> {tooltipData.enrichmentStdErr.toFixed(2)}</p>
          </div>
          <div>
            <p><b>Percentage of SNPs:</b> {tooltipData.percentageSNPs.toPrecision(2)}</p>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  )
}

import { Circle, Line, Polygon } from "@visx/shape";
import { LDSCDataPoint } from "./page";
import { AxisLeft } from "@visx/axis";
import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { Text } from '@visx/text';
import { MouseEvent } from "react";
import { toScientificNotation } from "../../common/utils";
import { Box, Typography } from "@mui/material";
import { getCellCategoryDisplayname, getCellCategoryColor } from "common/utility";


export const cellCategoryColors = {
  Bcells: "#078fff",
  Bulk_Tcells: "#e06666",
  CD4_Tcells: "#990000",
  CD8_Tcells: "#f6b26b",
  Erythroblasts: "#684fda",
  Leukemia: "#1ab19a",
  Myeloid: "#a64d79",
  NK: "#93c47d",
  Progenitors: "#d3b2ce",
  gd_Tcells: "#ff9900"
}
export const cellCategoryDisplaynames = {
  Bcells: "B Cells",
  Bulk_Tcells: "Bulk T Cells",
  CD4_Tcells: "CD4 T Cells",
  CD8_Tcells: "CD8 T Cells",
  Erythroblasts: "Erythroblasts",
  Leukemia: "Leukemic Cells",
  Myeloid: "Myeloid Cells",
  NK: "Natural Killer Cells",
  Progenitors: "Progenitor Cells",
  gd_Tcells: "Gamma Delta T Cells"
}

type Props = {
  width: number;
  height: number;
  data: LDSCDataPoint[];
  pValCutoff: number;
  stimView: "S" | "U" | "B",
  legendEntries: {label: string, value: string, color: string}[]
};

interface TooltipData {
  biosampleid: string,
  lineage: string,
  celltype: string,
  enrichment: number,
  enrichmentP: number,
  enrichmentStdErr: number,
  percentageSNPs: number,
}

export default function LDSCplot({ width, height, data, pValCutoff, stimView, legendEntries }: Props) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } = useTooltip<TooltipData>();

  const handleHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: LDSCDataPoint) => {
    showTooltip({
      tooltipTop: event.pageY,
      tooltipLeft: event.pageX,
      tooltipData: {
        biosampleid: point.biosampleid,
        lineage: getCellCategoryDisplayname(point.lineage),
        celltype: point.celltype,
        enrichment: point.enrichment,
        enrichmentP: point.enrichment_p,
        enrichmentStdErr: point.enrichment_std_error,
        percentageSNPs: point.snps
      }
    })
    event.currentTarget.setAttribute("stroke", "black") //Outline point
    event.currentTarget.setAttribute("transform", "scale(1.5)") //Grow point
    document.getElementById(`stdErr-${point.expvalue}`).setAttribute("stroke", "black") //Show std error bars
  }

  const handleLeaveHover = (event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>, point: LDSCDataPoint) => {
    hideTooltip()
    event.currentTarget.setAttribute("stroke", "none")
    event.currentTarget.setAttribute("transform", "scale(1)")
    document.getElementById(`stdErr-${point.expvalue}`).setAttribute("stroke", "none")
  }
  //TODO: Check if data needs to ordered
  const orderedData = [...data]   
    /*.sort((a, b) => {
      if (experimentInfo[a.celltype] && experimentInfo[b.celltype]) {
        return (experimentInfo[a.celltype].order - experimentInfo[b.celltype].order)
      } else {
        console.log("Couldn't find" + a.celltype + "or" + b.celltype)
        return 0
      }
    })*/

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
            const stimulated = point.stimulation === "stimulated"
            // Passes p-val cutoff and is correct stimulation
            const toBeShown = point.enrichment_p <= pValCutoff && (stimView === "S" && stimulated || stimView === "U" && !stimulated || stimView === "B")
            const commonProps = {
              opacity: toBeShown ? 1 : 0.1, //Sharply decrease opacity if not to be shown
              fill:  getCellCategoryColor(point.lineage),//getCellColor(point.expvalue.split('-')[1] as CellQueryValue | CellName),
              style: { transformOrigin: `${xScale(i)}px ${yScale(point.enrichment)}px` }, //Needed so that scale transforms are applied correctly
              onMouseMove: (event) => handleHover(event, point),
              onMouseLeave: (event) => handleLeaveHover(event, point)
            }

            return (
              <Group key={`datapoint-${point.expvalue}`}>
                {/* Standard error */}
                <Group id={`stdErr-${point.expvalue}`}>
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
        <Text x={width - 10} y={20} textAnchor="end" fontSize={12}>* Colors represent lineage, hovering shows standard error</Text>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
        >
          <div style={{ maxWidth: "20rem" }}>
            <p><b>Biosample:</b> {tooltipData.biosampleid}</p>
            <p><b>Lineage:</b> {tooltipData.lineage}</p>
            <p><b>Celltype:</b> {tooltipData.celltype}</p>
          </div>
          <br />
          <div>
            <p><b>Enrichment:</b> {tooltipData.enrichment.toFixed(2)}</p>
          </div>
          <div>
            <p><b>Enrichment <i>P</i> :</b> {toScientificNotation(tooltipData.enrichmentP, 2)}</p>
          </div>
          <div>
            <p><b>Enrichment Std Error:</b> {tooltipData.enrichmentStdErr.toFixed(2)}</p>
          </div>
          <div>
            <p><b>Percentage of SNPs:</b> {tooltipData.percentageSNPs.toPrecision(2)}</p>
          </div>
        </TooltipWithBounds>
      )}
      {legendEntries && legendEntries.length >0 &&
          <Box display="flex" justifyContent="space-between">
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <Box key={colIndex} display="flex" flexDirection="column" gap={1}>
              {legendEntries
                .filter((_, idx) => idx % 5 === colIndex)
                .map((entry, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: '12px', height: '12px', backgroundColor: entry.color }} />
                    <Typography variant="body2">
                      {entry.label} : {entry.value}
                    </Typography>
                  </Box>
                ))}
            </Box>
          ))}
        </Box>
        }
    </div>
  )
}
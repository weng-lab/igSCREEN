import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression"
import { GeneExpressionProps, PointMetadata } from "./GeneExpression"
import { Box, Button, FormControl, Grid2, InputLabel, Menu, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"
import { useEffect, useMemo, useRef, useState } from "react"
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { scaleLinear } from "d3-scale"
import { Point, ScatterPlot, ChartProps } from "@weng-lab/psychscreen-ui-components"
import { ParentSize } from "@visx/responsive"

export type GeneExpressionUmapProps<T> =
  GeneExpressionProps
  & {
    selectedPoints: PointMetadata[]
  }
  & Partial<ChartProps<T>>

const GeneExpressionUMAP = <T extends PointMetadata>({ name, id, selectedPoints, ...rest }: GeneExpressionUmapProps<T>) => {
  const [colorScheme, setColorScheme] = useState('geneexp');
  const [showLegend, setShowLegend] = useState<boolean>(false);

  const { data, loading, error } = useGeneExpression({ id })

  const handleColorSchemeChange = (
    event: SelectChangeEvent,
  ) => {
    setColorScheme(event.target.value);
  };
  const graphContainerRef = useRef(null);

  const map = {
    defaultOpen: false,
    position: {
      right: 50,
      bottom: 50,
    },
    ref: graphContainerRef
  };

  function logTransform(val: number) {
    return Math.log10(val + 1)
  }

  //find the max logTPM for the domain fo the gradient
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((x) => logTransform(x.value)));
  }, [data]);

  //generate the domain for the gradient based on the max number
  const generateDomain = (max: number, steps: number) => {
    return Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * max);
  };

  /**
   * @todo why is this using d3 scaleLinear and not visx
   */
  const colorScale = useMemo(() =>
    scaleLinear<number, number>()
      .domain(generateDomain(maxValue, 9)) // 9 evenly spaced domain stops (9 colors)
      .range(Array.from({ length: 9 }, (_, i) => i / 8)) // Normalize range for interpolation
      .clamp(true),
    [maxValue]
  );

  const generateGradient = (maxValue: number) => {
    const stops = generateDomain(maxValue, 8).map(value => interpolateYlOrRd(colorScale(value)));
    return `#808080, ${stops.join(", ")}`;
  };

  const scatterData: Point<PointMetadata>[] = useMemo(() => {
    if (!data) return []
    
    const isHighlighted = (x: PointMetadata) => selectedPoints.some(selected => selected.name === x.name)

    return data.map((x) => {
      const gradientColor = interpolateYlOrRd(colorScale(logTransform(x.value)));

      return {
        x: x.umap_1,
        y: x.umap_2,
        r: isHighlighted(x) ? 6 : 4,
        color: (isHighlighted(x) || selectedPoints.length === 0) ? ((colorScheme === 'geneexp') ? gradientColor : getCellCategoryColor(x.celltype)) : '#CCCCCC',
        shape: x.stimulation === "unstimulated" ? "circle" : "triangle" as "circle" | "triangle",
        metaData: x
      };
    }).sort((a, b) => (isHighlighted(b.metaData)) ? -1 : 0)
  }, [data, colorScale, selectedPoints, colorScheme]);

  const legendEntries = useMemo(() => {
    if (!scatterData) return [];

    if (colorScheme === "celltype") {
      // Count occurrences of each unique cellType
      const cellTypeCounts = scatterData.reduce((acc, point) => {
        const cellType = point.metaData.celltype;
        acc.set(cellType, (acc.get(cellType) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      return Array.from(cellTypeCounts.entries()).map(([cellType, count]) => ({
        label: getCellCategoryDisplayname(cellType),
        color: getCellCategoryColor(cellType),
        value: count
      }));
    }
  }, [scatterData, colorScheme]);

  const TooltipBody = (point: Point<PointMetadata>) => {
    return (
      <>
        <Typography><b>Category:</b> {getCellCategoryDisplayname(point.metaData.celltype)}</Typography>
        <Typography><b>Description:</b> {point.metaData.description}, {point.metaData.stimulation}</Typography>
        <Typography><b>Linear TPM:</b> {point.metaData.value.toFixed(2)}</Typography>
        <Typography><b>Source:</b> {point.metaData.source}</Typography>
      </>
    )
  }

  return (
    <Box>
      <FormControl sx={{ mb: 2 }}>
        <InputLabel>Color By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={colorScheme}
          label="Color By"
          onChange={handleColorSchemeChange}
          MenuProps={{disableScrollLock: true}}
        >
          <MenuItem value={"geneexp"}>Expression Level</MenuItem>
          <MenuItem value={"celltype"}>Cell Type</MenuItem>
        </Select>
      </FormControl>
      <Box padding={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative" }} ref={graphContainerRef}>
        <ParentSize>
          {({ width, height }) => {
            const squareSize = Math.min(width, height);
            return (
              <>
                <Typography variant="body2" align="right">
                  {"\u25EF unstimulated, \u25B3 stimulated "}
                </Typography>
                <ScatterPlot
                  {...rest}
                  width={squareSize}
                  height={squareSize}
                  pointData={scatterData}
                  selectable
                  loading={loading}
                  leftAxisLable=""
                  bottomAxisLabel=""
                  miniMap={map}
                  groupPointsAnchor="celltype"
                  tooltipBody={(point) => <TooltipBody {...point} />}

                />
              </>
            )
          }}
        </ParentSize>
        <Button variant="outlined" sx={{ position: "absolute", bottom: 10, left: 10, textTransform: "none" }} onClick={() => setShowLegend(!showLegend)}>Toggle Legend</Button>
      </Box>
      {/* legend */}
      {showLegend && (
          <Box mt={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography mb={1}><b>Legend</b></Typography>
            {colorScheme === "geneexp" ? (
              <>
                <Typography>Log₁₀(TPM + 1)</Typography>
                <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
                  <Typography sx={{ mr: 1 }}>0</Typography>
                  <Box
                    sx={{
                      height: "16px",
                      flexGrow: 1,
                      background: `linear-gradient(to right, #808080, ${generateGradient(maxValue)})`,
                      border: "1px solid #ccc"
                    }}
                  />
                  <Typography sx={{ ml: 1 }}>{maxValue.toFixed(2)}</Typography>
                </Box>
              </>
            ) : (
              /* Normal legend for cell types */
              <Box sx={{ display: 'flex', justifyContent: legendEntries.length / 6 >= 3 ? "space-between" : "flex-start", gap: legendEntries.length / 6 >= 4 ? 0 : 10 }}>
                {Array.from({ length: Math.ceil(legendEntries.length / 6) }, (_, colIndex) => (
                  <Box key={colIndex} sx={{ marginRight: 2 }}>
                    {legendEntries.slice(colIndex * 6, colIndex * 6 + 6).map((cellType, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Box sx={{ width: '12px', height: '12px', backgroundColor: cellType.color, marginRight: 1 }} />
                        <Typography>
                          {`${cellType.label
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}`}
                          {colorScheme === "celltype" ? `: ${cellType.value}` : ""}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
      )}
    </Box>
  )
}

export default GeneExpressionUMAP
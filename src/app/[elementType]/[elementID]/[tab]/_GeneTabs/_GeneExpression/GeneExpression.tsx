import { useQuery } from "@apollo/client";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ParentSize } from "@visx/responsive";
import { DataTable, DataTableColumn, Point, ScatterPlot } from "@weng-lab/psychscreen-ui-components";
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility";
import { scaleLinear } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { useEffect, useMemo, useRef, useState } from "react";
import { gql } from "types/generated";
import { GeneExpressionQuery } from "types/generated/graphql";

const GET_GENE_EXPRESSION = gql(`
  query GeneExpression($gene_id: String!) {
    immuneRnaUmapQuery(gene_id: $gene_id) {
      umap_1
      umap_2
      celltype
      source
      description
      expid
      name
      tree_celltype
      value
      stimulation
    }
  }
`)

type GeneExpressionProps = {
  name: string,
  id: string
}

type PointMetadata = GeneExpressionQuery["immuneRnaUmapQuery"][0]

const GeneExpression = ({ name, id }: GeneExpressionProps) => {
  const [colorScheme, setColorScheme] = useState('geneexp');
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<PointMetadata>(null)
  const [hoveredPoint, setHoveredPoint] = useState<PointMetadata>(null)

  const handleColorSchemeChange = (
    event: SelectChangeEvent,
  ) => {
    setColorScheme(event.target.value);
  };

  const handleRowClick = (pointInfo: PointMetadata) => {
    console.log(pointInfo)
    if (pointInfo === selectedPoint) {
      setSelectedPoint(null)
    } else setSelectedPoint(pointInfo)
  }

  const handleRowMouseEnter = (pointInfo: PointMetadata) => {
    setHoveredPoint(pointInfo)
  }

  const handleRowMouseLeave = () => {
    setHoveredPoint(null)
  }

  const { loading, data } = useQuery(GET_GENE_EXPRESSION, {
    variables: {
      gene_id: id.split('.')[0]
    },
  })

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
    if (!data || data.immuneRnaUmapQuery.length === 0) return 0;
    return Math.max(...data.immuneRnaUmapQuery.map((x) => logTransform(x.value)));
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

    return data.immuneRnaUmapQuery.map((x) => {
      const gradientColor = interpolateYlOrRd(colorScale(logTransform(x.value)));
      const isHighlighted = x.name === selectedPoint?.name || x.name === hoveredPoint?.name

      return {
        x: x.umap_1,
        y: x.umap_2,
        r: isHighlighted ? 6 : 4,
        color: (isHighlighted || (!selectedPoint && !hoveredPoint)) ? ((colorScheme === 'geneexp' || colorScheme === 'ZScore') ? gradientColor : getCellCategoryColor(x.celltype)) : '#CCCCCC',
        shape: x.stimulation === "unstimulated" ? "circle" : "triangle" as "circle" | "triangle",
        metaData: x
      };
    }).sort((a, b) => (selectedPoint?.name === b.metaData.name || hoveredPoint?.name === b.metaData.name) ? -1 : 0)
  }, [data, colorScale, selectedPoint, hoveredPoint, colorScheme]);

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

  useEffect(() => {
    const graphElement = graphContainerRef.current;

    const handleWheel = (event: WheelEvent) => {
      // Prevent default scroll behavior when using the wheel in the graph
      event.preventDefault();
    };
    if (graphElement) {
      graphElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (graphElement) {
        graphElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const TooltipBody = (point: Point<PointMetadata>) => {
    return (
      <>
        <Typography><b>Category:</b> {getCellCategoryDisplayname(point.metaData.celltype)}</Typography>
        <Typography><b>Description:</b> {point.metaData.description}, {point.metaData.stimulation}</Typography>
        {/* <Typography><b>Log<sub>10</sub>(TPM + 1):</b> {logTransform(point.metaData.value).toFixed(2)}</Typography> */}
        <Typography><b>Linear TPM:</b> {point.metaData.value.toFixed(2)}</Typography>
        <Typography><b>Source:</b> {point.metaData.source}</Typography>
      </>
    )
  }

  const cols: DataTableColumn<PointMetadata>[] = [
    {
      header: "Cell Type",
      value: (row) => row.description
    },
    {
      header: "Stimulation",
      value: (row) => row.stimulation
    },
    // {
    //   header: "Log10(TPM+1)",
    //   HeaderRender: () => <Typography variant="body2">Log<sub>10</sub>(TPM + 1)</Typography>,
    //   value: (row) => logTransform(row.value).toFixed(2)
    // },
    {
      header: "Linear TPM",
      HeaderRender: () => <Typography variant="body2">Linear TPM</Typography>,
      value: (row) => row.value.toFixed(2)
    },
    {
      header: "Category",
      value: (row) => getCellCategoryDisplayname(row.celltype)
    },
    {
      header: "Source",
      value: (row) => row.source
    },
  ]

  return (
    <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Table View</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DataTable
              rows={data?.immuneRnaUmapQuery || []}
              tableTitle={`${name} Gene Expression`}
              columns={cols}
              sortColumn={2}
              onRowClick={handleRowClick}
              onRowMouseEnter={handleRowMouseEnter}
              onRowMouseLeave={handleRowMouseLeave}
              highlighted={selectedPoint}
              searchable
            />
          </AccordionDetails>
        </Accordion>
      </div>
      <Stack width={"100%"}>
        
        <FormControl sx={{ alignSelf: 'flex-start' }}>
          <InputLabel>Color By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={colorScheme}
            label="Color By"
            onChange={handleColorSchemeChange}
          >
            <MenuItem value={"geneexp"}>Expression Level</MenuItem>
            <MenuItem value={"celltype"}>Cell Type</MenuItem>
          </Select>
        </FormControl>
        <Box padding={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '600px', position: 'relative' }} ref={graphContainerRef}>
          <ParentSize>
            {({ width, height }) => {
              const squareSize = Math.min(width, height);
              return (
                <>
                  <Typography variant="body2" align="right">
                    {"\u25EF unstimulated, \u25B3 stimulated "}
                  </Typography>
                  <ScatterPlot
                    width={squareSize}
                    height={squareSize}
                    pointData={scatterData}
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
          <Grid2 size={12}>
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
          </Grid2>
        )}
      </Stack>
    </Stack>
  )
}

export default GeneExpression
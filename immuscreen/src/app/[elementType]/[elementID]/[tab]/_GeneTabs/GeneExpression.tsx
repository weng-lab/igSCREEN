import { useQuery } from "@apollo/client";
import { Box, Button, Grid2, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ParentSize } from "@visx/responsive";
import { Text } from '@visx/text';
import { Point, ScatterPlot } from "@weng-lab/psychscreen-ui-components";
import { CellName } from "app/celllineage/types";
import { getCellColor, getCellDisplayName } from "app/celllineage/utils";
import { scaleLinear } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { useEffect, useMemo, useRef, useState } from "react";
import { gql } from "types/generated";

const RNA_UMAP_QUERY = gql(`
  query RnaUmap($gene_id: String!) {
    calderonRnaUmapQuery(gene_id: $gene_id){
      name
      donor
      stimulation      
      celltype
      class
      umap_1
      umap_2
      value
    }
  }
`)

type PointMetaData = {
  cellType: string;
  name: string;
  class: string;
  value: number;
}

type GeneExpressionProps = {
  name: string
}

const GeneExpression = ({ name }: GeneExpressionProps) => {
  const [colorScheme, setcolorScheme] = useState('geneexp');
  const [showLegend, setShowLegend] = useState<boolean>(false);

  const graphContainerRef = useRef(null);

  const handleColorSchemeChange = (
    event: React.MouseEvent<HTMLElement>,
    newScheme: string,
  ) => {
    setcolorScheme(newScheme);
  };

  const { loading: rnaumaploading, data: rnumapdata } = useQuery(RNA_UMAP_QUERY, {
    variables: {
      gene_id: name // argument is "gene_id" but actually only accepts gene name (symbol)
    },
  })


  const map = {
    defaultOpen: false,
    position: {
      right: 50,
      bottom: 50,
    },
    ref: graphContainerRef
  };

  //find the max logTPM for the domain fo the gradient
  const maxValue = useMemo(() => {
    if (!rnumapdata || rnumapdata.calderonRnaUmapQuery.length === 0) return 0;
    return Math.max(...rnumapdata.calderonRnaUmapQuery.map((x) => Math.log(x.value + 0.01)));
  }, [rnumapdata]);

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

  const scatterData: Point<PointMetaData>[] = useMemo(() => {
    if (!rnumapdata) return [];
    console.log(rnumapdata.calderonRnaUmapQuery)

    return rnumapdata.calderonRnaUmapQuery.map((x) => {
      const gradientColor = Math.log(x.value + 0.01) <= 0 ? "#808080" : interpolateYlOrRd(colorScale(Math.log(x.value + 0.01)));

      return {
        x: x.umap_1,
        y: x.umap_2,
        r: 5,
        color: (colorScheme === 'geneexp' || colorScheme === 'ZScore') ? gradientColor : getCellColor(x.celltype as CellName),
        shape: (x.stimulation === "U" ? "circle" : "triangle"),
        metaData: {
          cellType: x.celltype,
          name: x.name,
          class: x.class,
          value: +x.value.toFixed(2)
        }
      };
    });
  }, [rnumapdata, colorScale, colorScheme]);

  const legendEntries = useMemo(() => {
    if (!scatterData) return [];

    if (colorScheme === "celltype") {
      // Count occurrences of each unique cellType
      const cellTypeCounts = scatterData.reduce((acc, point) => {
        const cellType = point.metaData.cellType;
        acc.set(cellType, (acc.get(cellType) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      return Array.from(cellTypeCounts.entries()).map(([cellType, count]) => ({
        label: getCellDisplayName(cellType as CellName),
        color: getCellColor(cellType as CellName),
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

  return (
    <Grid2
      size={{
        xs: 12,
        lg: 12
      }}>
      <Grid2 size={6}>
        Color Scheme:
        <br /><br />
        <ToggleButtonGroup
          color="primary"
          value={colorScheme}
          exclusive
          onChange={handleColorSchemeChange}
          aria-label="Platform"
        >
          <ToggleButton sx={{ textTransform: 'none' }} value="geneexp">Gene Expression</ToggleButton>
          <ToggleButton sx={{ textTransform: 'none' }} value="celltype">Cell Type Cluster</ToggleButton>
        </ToggleButtonGroup>
        <br />
        <br />
        <Box overflow={"hidden"} padding={1} sx={{ border: '2px solid', borderColor: 'grey.400', borderRadius: '8px', height: '60vh', position: 'relative' }} ref={graphContainerRef}>
          <ParentSize>
            {({ width, height }) => {
              const squareSize = Math.min(width, height);

              return (
                <>
                  <svg
                    width={width}
                    height={30}
                    style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                  >
                    <Text x={10} y={20} textAnchor="start" fontSize={12}>
                      {"TPM"}
                    </Text>
                  </svg>
                  <svg
                    width={width}
                    height={30}
                    style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                  >
                    <Text x={width - 10} y={20} textAnchor="end" fontSize={12}>
                      {"\u25EF unstimulated, \u25B3 stimulated "}
                    </Text>
                  </svg>
                  <ScatterPlot
                    width={squareSize}
                    height={squareSize}
                    pointData={scatterData}
                    loading={rnaumaploading}
                    leftAxisLable="UMAP-2"
                    bottomAxisLabel="UMAP-1"
                    miniMap={map}
                    groupPointsAnchor="cellType"
                  />
                </>
              )
            }}
          </ParentSize>
          <Button variant="outlined" sx={{ position: "absolute", bottom: 10, left: 10, textTransform: "none" }} onClick={() => setShowLegend(!showLegend)}>Toggle Legend</Button>
        </Box>
      </Grid2>
      {/* legend */}
      {showLegend && (
        <Grid2 size={12}>
          <Box mt={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography mb={1}><b>Legend</b></Typography>
            {colorScheme === "geneexp" ? (
              <>
                <Typography>Colored by Log₁₀TPM</Typography>
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
    </Grid2>
  )
}

export default GeneExpression
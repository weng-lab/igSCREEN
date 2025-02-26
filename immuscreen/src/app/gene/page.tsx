"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Tabs, Typography, Box, Button } from "@mui/material"
import { client, toScientificNotation } from "../../common/utils"
import { StyledTab } from "../../common/utils"
import Grid2 from "@mui/material/Grid2"
import { useQuery } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { DataTable, ScatterPlot, Point } from "@weng-lab/psychscreen-ui-components"
import { GenomeBrowserView } from "../../common/gbview/genomebrowserview"
import { GeneAutoComplete } from "../../common/components/mainsearch/GeneAutocomplete"
import { RNA_UMAP_QUERY, EQTL_QUERY } from "./queries"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { PointMetaData } from "./types"
import { getCellColor, getCellDisplayName } from "../../app/celllineage/utils";
import { ParentSize } from '@visx/responsive';
import { Text } from '@visx/text';
import { scaleLinear } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import { CellName } from "../celllineage/types"

const Gene = () => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!

  const [value, setValue] = useState(0)
  const [colorScheme, setcolorScheme] = useState('geneexp');
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const graphContainerRef = useRef(null);

  const handleColorSchemeChange = (
    event: React.MouseEvent<HTMLElement>,
    newScheme: string,
  ) => {
    setcolorScheme(newScheme);
  };

  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }

  const { loading: rnaumaploading, data: rnumapdata } = useQuery(RNA_UMAP_QUERY, {
    variables: {
      gene_id: searchParams.get('gene')
    },
    skip: !searchParams.get('gene'),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })
  const { loading: loading, data: data } = useQuery(EQTL_QUERY, {
    variables: {
      study: "GTEX",
      geneid: searchParams.get("geneid")
    },
    skip: !searchParams.get("geneid"),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  const { loading: soskicLoading, data: soskicData } = useQuery(EQTL_QUERY, {
    variables: {
      study: "Soskic.Trynka",
      geneid: searchParams.get("geneid")
    },
    skip: !searchParams.get("geneid"),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  const { loading: yazarLoading, data: yazarData } = useQuery(EQTL_QUERY, {
    variables: {
      study: "Yazar.Powell",
      geneid: searchParams.get("geneid")
    },
    skip: !searchParams.get("geneid"),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  const map = {
    defaultOpen: false,
    position: {
      right: 50,
      bottom: 50,
    },
    ref: graphContainerRef
  };

  const colorInterpolator = interpolateRgb("yellow", "red");

  const colorScale = scaleLinear<number, number>()
    .domain([1.64, 3, 6, 12])
    .range([0, 0.3, 0.7, 1]) // Maps to interpolation percentages
    .clamp(true);

  const scatterData: Point<PointMetaData>[] = useMemo(() => {
    if (!rnumapdata) return [];
    console.log(rnumapdata.calderonRnaUmapQuery)

    return rnumapdata.calderonRnaUmapQuery.map((x) => {
      const gradientColor = Math.log(x.value + 0.01) < 1.64 ? "#808080" : colorInterpolator(colorScale(Math.log(x.value + 0.01)));

      return {
        x: x.umap_1,
        y: x.umap_2,
        r: 5,
        color: (colorScheme === 'geneexp' || colorScheme === 'ZScore') ? gradientColor : getCellColor(x.celltype),
        shape: (x.stimulation === "U" ? "circle" : "triangle"),
        metaData: {
          cellType: x.celltype,
          name: x.name,
          class: x.class,
          value: Math.log(x.value + 0.01).toFixed(2)
        }
      };
    });
  }, [rnumapdata, colorInterpolator, colorScale, colorScheme]);

  const legendEntries = useMemo(() => {
    if (!scatterData) return [];

    if (colorScheme === "geneexp") {
      const gradientStops = [1.64, 3, 6, 12];

      return gradientStops.map(value => ({
        label: `≥ ${value}`,
        color: colorInterpolator(colorScale(value)),
        value
      }));
    } else {
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
  }, [scatterData, colorScheme, colorInterpolator, colorScale]);

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

  return (searchParams.get('gene') ? // Gene Selected View
    <Grid2 container sx={{ maxWidth: "90%", mr: "auto", ml: "auto", mt: "3rem" }}>
      <Grid2 container spacing={3} sx={{ mt: "2rem", mb: "1rem" }}>
        <Grid2
          size={{
            xs: 12,
            lg: 12
          }}>
          {searchParams.get("gene") && <Typography variant="h4">Gene Details: <i>{searchParams.get("gene")}</i></Typography>}
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            lg: 12
          }}>
          <Tabs aria-label="basic tabs example" value={value} onChange={handleChange}>
            <StyledTab label="Genome Browser" />
            <StyledTab label="Gene Expression" />
            <StyledTab label="eQTLs" />
          </Tabs>
        </Grid2>
      </Grid2>
      {value === 0 &&
        <Grid2 size={12}>
          <GenomeBrowserView
            gene={searchParams.get('gene')}
            assembly={"GRCh38"}
            coordinates={{
              start: +searchParams.get("start") - 20000, end: +searchParams.get("end") + 20000,
              chromosome: searchParams.get("chromosome")
            }}
          />
        </Grid2>
      }
      {value === 1 && rnumapdata && !rnaumaploading && rnumapdata.calderonRnaUmapQuery.length > 0 &&
        <>
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
                            {"Log₁₀TPM"}
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
                <Button variant="outlined" sx={{position: "absolute", bottom: 10, left: 10, textTransform: "none"}} onClick={() => setShowLegend(!showLegend)}>Toggle Legend</Button>
              </Box>
            </Grid2>
            {/* legend */}
            {showLegend && (
              <Grid2 size={12}>
                <Box mt={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography mb={1}><b>Legend</b></Typography>
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
                </Box>
              </Grid2>
            )}

          </Grid2>
        </>
      }
      {value === 2 && !loading && !soskicLoading && !yazarLoading &&
        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <DataTable
              columns={[
                {
                  header: "Variant Id",
                  value: (row: any) => row.variant_id || "",
                },
                {
                  header: "Nominal P",
                  HeaderRender: () => <Typography variant="body2">Nominal <i>P</i></Typography>,
                  value: (row: any) => row.pval_nominal && toScientificNotation(row.pval_nominal, 2) || 0,
                },
                {
                  header: "Beta P",
                  HeaderRender: () => <Typography variant="body2">Beta <i>P</i></Typography>,
                  value: (row: any) => row.pval_beta && toScientificNotation(row.pval_beta, 2) || 0,
                }
              ]}
              tableTitle={`GTEX whole-blood eQTLs for ${searchParams.get('gene')}:`}
              rows={data?.icreeQTLQuery || []}
              itemsPerPage={10}
            />
          </Grid2>
          <Grid2 size={12}>
            <DataTable
              columns={[
                {
                  header: "SNP",
                  value: (row: any) => row.rsid || "",
                },
                {
                  header: "P",
                  HeaderRender: () => <Typography variant="body2"><i>P</i></Typography>,
                  value: (row: any) => row.pvalue && toScientificNotation(row.pvalue, 2) || 0,
                },
                {
                  header: "Q",
                  HeaderRender: () => <Typography variant="body2"><i>Q</i></Typography>,
                  value: (row: any) => row.qvalue && toScientificNotation(row.qvalue, 2) || 0,
                },
                {
                  header: "Celltype",
                  value: (row: any) => row.celltype || "",
                }
              ]}
              tableTitle={`Yazar.Powell eQTLs for ${searchParams.get('gene')}:`}
              rows={(yazarData.icreeQTLQuery) || []}
              sortColumn={3}
              itemsPerPage={10}
            />
          </Grid2>
          <Grid2 size={12}>
            <DataTable
              columns={[
                {
                  header: "Variant Id",
                  value: (row: any) => row.variant_id || "",
                },
                {
                  header: "Nominal P",
                  HeaderRender: () => <Typography variant="body2">Nominal <i>P</i></Typography>,
                  value: (row: any) => row.pval_nominal && toScientificNotation(row.pval_nominal, 2) || 0,
                },
                {
                  header: "Beta P",
                  HeaderRender: () => <Typography variant="body2">Beta <i>P</i></Typography>,
                  value: (row: any) => row.pval_beta && toScientificNotation(row.pval_beta, 2) || 0,
                },
                {
                  header: "Celltype",
                  value: (row: any) => row.celltype || "",
                }
              ]}
              tableTitle={`Soskic.Trynka eQTLs for ${searchParams.get('gene')}:`}
              rows={(soskicData.icreeQTLQuery) || []}
              sortColumn={3}
              itemsPerPage={10}
            />
          </Grid2>
        </Grid2>
      }
    </Grid2> : //Gene Not Selected View
    <Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
      <Grid2 sx={{ mt: "5em", ml: "2em" }} size={6}>
        <Typography variant="h3">Gene Portal</Typography>
        <br />
        <br />
        <br />
        {<GeneAutoComplete assembly={"GRCh38"} />}
      </Grid2>
    </Grid2>);
}

export default Gene;
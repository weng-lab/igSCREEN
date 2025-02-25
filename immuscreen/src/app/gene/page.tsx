"use client"
import React, { useMemo, useRef, useState } from "react"
import { Tabs, Tab, Typography, colors, Stack, Box } from "@mui/material"
import { client, toScientificNotation } from "../../common/utils"
import { StyledTab } from "../../common/utils"
import Grid2 from "@mui/material/Grid2"
import { useQuery } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { DataTable, DataTableColumn, ScatterPlot, Point } from "@weng-lab/psychscreen-ui-components"
import { GenomeBrowserView } from "../../common/gbview/genomebrowserview"
import { GeneAutoComplete } from "../../common/components/mainsearch/GeneAutocomplete"
import { UmapPlot } from "../../common/components/umapplot"
import { RNA_UMAP_QUERY, EQTL_QUERY } from "./queries"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { PointMetaData } from "./types"
import { getCellColor } from "../../app/celllineage/utils";
import { ParentSize } from '@visx/responsive';

const Gene = () => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!

  const [value, setValue] = useState(0)
  const [colorScheme, setcolorScheme] = useState('geneexp');
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
    defaultOpen: true,
    position: {
      right: 50,
      bottom: 50,
    },
    ref: graphContainerRef
  };

  const scatterData: Point<PointMetaData>[] = useMemo(() => {
    if (!rnumapdata) return [];
    console.log(rnumapdata.calderonRnaUmapQuery)

    return rnumapdata.calderonRnaUmapQuery.map((x) => {

      return {
        x: x.umap_1,
        y: x.umap_2,
        r: 5,
        color: (colorScheme === 'geneexp' || colorScheme === 'ZScore') ?  x.value > 1.64 ? 'red' : 'yellow' : getCellColor(x.celltype),
        shape: (x.stimulation === "U" ? "circle" : "triangle"),
        metaData: {
          cellType: x.celltype,
          name: x.name,
          class: x.class,
          value: Math.log(x.value + 0.01)
        }
      };
    });
  }, [rnumapdata, colorScheme]);

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
      <Grid2
        size={{
          xs: 12,
          lg: 12
        }}>
        Color Scheme:
        <br /><br />
        <ToggleButtonGroup
          color="primary"
          value={colorScheme}
          exclusive
          onChange={handleColorSchemeChange}
          aria-label="Platform"
        >
          <ToggleButton sx={{textTransform: 'none'}} value="geneexp">Gene Expression</ToggleButton>
          <ToggleButton sx={{textTransform: 'none'}} value="celltype">Cell Type Cluster</ToggleButton>
        </ToggleButtonGroup>
        <br />
        <br />
        <Box overflow={"hidden"} padding={1} sx={{ border: '2px solid', borderColor: 'grey.400', borderRadius: '8px', height: '57vh', position: 'relative' }} ref={graphContainerRef}>
            <ParentSize>
              {({ width, height }) => {
                const squareSize = Math.min(width, height);

                return (
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
                )
              }}
            </ParentSize>
          </Box>
        <UmapPlot colorScheme={colorScheme} data={rnumapdata.calderonRnaUmapQuery.map(d => { return { ...d, value: Math.log(d.value + 0.01) } })} plottitle={"log10 TPM"} />
      </Grid2>
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
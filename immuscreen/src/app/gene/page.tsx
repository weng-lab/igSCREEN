"use client"
import React, { useState} from "react"
import { Tabs, Tab, Typography, colors } from "@mui/material"
import { client } from "../../common/utils"
import { StyledTab } from "../../common/utils"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useQuery } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { GenomeBrowserView } from "../../common/gbview/genomebrowserview"
import { GeneAutoComplete } from "../../common/components/mainsearch/GeneAutocomplete"
import { UmapPlot } from "../../common/components/umapplot"
import { RNA_UMAP_QUERY, EQTL_QUERY } from "./queries"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const Gene = () =>{
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  
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


  const [colorScheme, setcolorScheme] = useState('genexp');
  const handleColorSchemeChange = (
    event: React.MouseEvent<HTMLElement>,
    newScheme: string,
  ) => {
    setcolorScheme(newScheme);
  };

  return  !searchParams.get('gene') ? <main>

<Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
        <Grid2 xs={6} sx={{ mt: "5em", ml:"2em"}}>
          <Typography variant="h3">Gene Portal</Typography>
          
          <br/>
         
          <br/>
          <br/>
          {<GeneAutoComplete textColor={"black"} assembly={"GRCh38"} /> }
        </Grid2>
       
      </Grid2>

  </main>: (
    <main>
      <Grid2 container  sx={{ maxWidth: "80%", mr: "auto", ml: "auto", mt: "3rem" }}>
            <Grid2 container spacing={3} sx={{ mt: "2rem", mb: "1rem" }}>
                  <Grid2 xs={12} lg={12}>
                      {searchParams.get("gene") && <Typography variant="h4">Gene Details: {searchParams.get("gene")}</Typography>}
                  </Grid2>
                  <Grid2 xs={12} lg={12}>
                    <Tabs aria-label="basic tabs example" value={value} onChange={handleChange}>
                    <StyledTab label="Genome Browser" />
                              <StyledTab label="eQTLs" />
                        <StyledTab label="Gene Expression UMAP" />
                    </Tabs>
                  </Grid2>
            </Grid2>
           
            {value===1 && !loading && !soskicLoading && !yazarLoading  &&
                <Grid2 container>
                    <Grid2 xs={6} lg={6}>
                            <DataTable
                              columns={[
                               
                                {
                                header: "Variant Id",
                                value: (row) => row.variant_id || "",
                                
                              },
                              {
                                header: "Nominal P-Value",
                                value: (row) => row.pval_nominal && row.pval_nominal.toExponential(2) || 0,
                              },
                              {
                                header: "Beta P-Value",
                                value: (row) => row.pval_beta && row.pval_beta.toExponential(2) || 0,
                              }
                              
                              ]}
                        tableTitle={`GTEX eQTLs have been identified for ${searchParams.get('gene')}:`}
                        rows={data.icreeQTLQuery || []}
                        
                        
                        itemsPerPage={10}
                      />
                      </Grid2>
                      <Grid2 xs={0.5} lg={0.5}></Grid2>
                      <Grid2 xs={5.5} lg={5.5}>
                            <DataTable
                              columns={[
                                
                                {
                                header: "SNP",
                                value: (row) => row.rsid || "",
                                
                              },
                              
                              {
                                header: "P-Value",
                                value: (row) => row.pvalue && row.pvalue.toExponential(2) || 0 ,
                              },
                              {
                                header: "Q-Value",
                                value: (row) => row.qvalue && row.qvalue.toExponential(2) || 0,
                              },
                              {
                                header: "Celltype",
                                value: (row) => row.celltype || "",
                                
                              }
                              ]}
                        tableTitle={`Yazar.Powell eQTLs have been identified for ${searchParams.get('gene')}:`}
                        rows={(yazarData.icreeQTLQuery) || []}
                        
                        sortColumn={3}
                        itemsPerPage={10}
                      />
                      </Grid2>
                      
                      <Grid2 xs={6} lg={6}>
                            <DataTable
                              columns={[
                                
                                {
                                  header: "Variant Id",
                                  value: (row) => row.variant_id || "",
                                  
                                },
                                {
                                  header: "Nominal P-Value",
                                  value: (row) => row.pval_nominal && row.pval_nominal.toExponential(2) || 0,
                                },
                                {
                                  header: "Beta P-Value",
                                  value: (row) => row.pval_beta && row.pval_beta.toExponential(2) || 0,
                                },
                              {
                                header: "Celltype",
                                value: (row) => row.celltype || "",
                                
                              }
                              ]}
                        tableTitle={`Soskic.Trynka  eQTLs have been identified for ${searchParams.get('gene')}:`}
                        rows={(soskicData.icreeQTLQuery) || []}
                        
                        sortColumn={3}
                        itemsPerPage={10}
                      />
                      
                      </Grid2>
                    
                   
                </Grid2>    
            }
            {value===0 && <GenomeBrowserView
                gene={searchParams.get('gene')}
                
                assembly={"GRCh38"}
                coordinates={{ start: +searchParams.get("start")-20000, end: +searchParams.get("end")+20000, 
                chromosome:searchParams.get("chromosome") }}
              />}
            {value===2 && rnumapdata && !rnaumaploading && rnumapdata.calderonRnaUmapQuery.length>0 &&
            <Grid2 xs={12} lg={12}>
              Color Scheme:
              <br/><br/>
              <ToggleButtonGroup
              color="primary"
              value={colorScheme}
              exclusive
              onChange={handleColorSchemeChange}
              aria-label="Platform"
              >
            <ToggleButton value="geneexp">Gene Expression</ToggleButton>
            <ToggleButton value="celltype">CellType Cluster</ToggleButton>      
            </ToggleButtonGroup>
            <br/>
            <br/>
              <UmapPlot colorScheme={colorScheme} data={rnumapdata.calderonRnaUmapQuery.map(d=>{return {...d, value: Math.log(d.value+0.01)} })} plottitle={"log10 TPM"}/>
            </Grid2>
            }
        </Grid2>
       
      
    </main>
  )
}

export default Gene;
"use client"
import React, {useState} from "react"
import { useRouter } from "next/navigation"
import { StyledTab } from "../../common/utils"
import { client } from "../../common/utils"
import SearchIcon from "@mui/icons-material/Search"
import { Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { TextField, IconButton, InputAdornment } from "@mui/material"
import { FormControl, MenuItem } from "@mui/material"
import { useQuery } from "@apollo/client"
import { ReadonlyURLSearchParams, useSearchParams} from "next/navigation"
import { GenomeBrowserView } from "../../common/gbview/genomebrowserview"
import { CcreAutoComplete } from "../../common/components/mainsearch/CcreAutocomplete"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { ATACUMAP } from "./atacumap"
import { AtacBarPlot } from "./atacbarplot"
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { stringToColour } from "./utils";
import { ICRES_CT_ZSCORES_QUERY, ICRES_BYCT_ZSCORES_QUERY, ICRES_QUERY, EBI_ASSO_QUERY } from "./queries";
import { cellColors } from "./consts";


import {IcresByRegion} from "./icresbyregion"


//Need better text styling

export default function Icres() {

  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  const router = useRouter()
  const [searchvalue, setSearchValue] = useState("")
  const [study, setStudy] = useState("Calderon")
  const [selectedPortal, setSelectedPortal] = useState<string>("Genomic Region");
  const [zscoreValue, setzscoreValue] =  useState(0)
  const handleSelectedPortal = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };
 
  const {loading: icrezscoreloading, data: icrezscoredata} = useQuery(ICRES_CT_ZSCORES_QUERY,{
    variables: {
      accession: searchParams.get('accession'),
      study:[study]
    },
    skip: !searchParams.get('accession'),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })
  const {loading: icrebyctzscoreloading, data: icrebyctzscoredata} = useQuery(ICRES_BYCT_ZSCORES_QUERY,{
    variables: {
      accession: searchParams.get('accession'),
      study:[study]
    },
    skip: !searchParams.get('accession'),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })
 

  const { loading: aloading, data: adata } = useQuery(ICRES_QUERY, {
    variables: {
      accession: searchParams.get('accession')
    },
    skip: !(searchParams && searchParams.get("accession")),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })
  // console.log(aloading,adata)


let barplotdata = icrezscoredata && icrezscoredata.calderoncorcesAtacQuery.map(ic=>{
  return  {
    ...ic,
    color: cellColors[ic.celltype] || stringToColour(ic.celltype),
    value: ic.value

  }
})
let barplotbyctdata = icrebyctzscoredata && icrebyctzscoredata.calderoncorcesByCtAtacQuery.map(ic=>{
  return  {
    ...ic,
    color: cellColors[ic.celltype] ||stringToColour(ic.celltype),
    value: ic.value

  }
})

barplotdata =  !icrezscoreloading && icrezscoredata && icrezscoredata.calderoncorcesAtacQuery.length>0 && barplotdata.sort((a, b) => a.order-b.order);
barplotbyctdata =  !icrebyctzscoreloading && icrebyctzscoredata && icrebyctzscoredata.calderoncorcesByCtAtacQuery.length>0 && barplotbyctdata.sort((a, b) => a.order-b.order);

const {data: ebidata} = useQuery(EBI_ASSO_QUERY,{
    variables: {
      accession: searchParams.get('accession')
    },
    skip: !searchParams.get('accession'),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })
  
  const handleChange = (_, newValue: number) => {
    setValue(newValue)
}
const handleZscoreChange = (_, newValue: number) => {
    setzscoreValue(newValue)
}
const handleSearchChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSearchValue(event.target.value)
}
function handleSubmit() {    
    //if submitted with empty value, use default search
    if (searchvalue == "") {
      router.push(`/icres?chromosome=chr11&start=5205263&end=5381894`)
      return
    }
    const input = searchvalue.split(":")
    const chromosome = input[0]
    const coordinates = input[1].split("-")
    const start = coordinates[0]
    const end = coordinates[1]
    router.push(`/icres?chromosome=${chromosome}&start=${start}&end=${end}`)
}

// console.log("coordinates", adata && adata.iCREQuery[0].coordinates)
console.log("active cells: ", adata && adata.iCREQuery[0].celltypes)
  return !searchParams.get('accession') && !searchParams.get('chromosome') ?  (
  <main>
    <Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
      <Grid2 xs={6} sx={{ mt: "5em", ml:"2em"}}>
        <Typography variant="h3">iCRE Portal</Typography>    
        <br/>
        <FormControl variant="standard">
          <Select
            id="portal_Select"
            value={selectedPortal}
            // defaultValue={10}
            onChange={handleSelectedPortal}
          >
            <MenuItem value={"Genomic Region"}>Genomic Region</MenuItem>
            <MenuItem value={"iCREs"}>iCREs</MenuItem>
          </Select>
        </FormControl>
        <br/>
        <br/>
        <br/>
        {selectedPortal==="Genomic Region" ?  
          <TextField
                  variant="outlined"
                  InputLabelProps={{ shrink: true, style: { color: "black" } }}
                  label="Enter a genomic region in form chr:start-end."
                  placeholder="chr11:5205263-5381894"
                  value={searchvalue}
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.code === "Enter") {
                      handleSubmit()
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ color:  "black" }}>
                        <IconButton aria-label="Search" type="submit" onClick={() => handleSubmit()} sx={{ color:  "black" }}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: { color:  "black" },
                  }}
                  sx={{ mr: "1em", ml: "1em", fieldset: { borderColor:  "black" } }}
            /> 
            : <CcreAutoComplete textColor={"black"} assembly={"GRCh38"}/> 
        }
      </Grid2> 
    </Grid2>
</main>): searchParams.get('chromosome') ? (
   <IcresByRegion/>
  ) :  (
    <main>
      <Grid2 container  sx={{ maxWidth: "80%", mr: "auto", ml: "auto", mt: "3rem" }}>   
            <Grid2 container sx={{  ml:"0.5em", mt: "4rem", mb: "2rem" }}>
              <Grid2 xs={12} lg={12}>
              {searchParams.get("accession") && <Typography variant="h4">Accession Details: {searchParams.get("accession")}</Typography>}
              </Grid2>
              <Grid2 xs={12} lg={12}>
                  <Tabs aria-label="icres_tabs" value={value} onChange={handleChange}>
                      <StyledTab label="Genome Browser" />
                      <StyledTab label="Calderon ATAC UMAP" />
                      <StyledTab label="EBI Associations" />
                      <StyledTab label="Cell type specific zscores" />
                      
                  </Tabs>
              </Grid2>
            </Grid2>
           
            {value===0 && adata &&
            <Grid2 xs={12} lg={12}>
            <GenomeBrowserView                
                accession={
                  {
                    name: adata.iCREQuery[0].accession,
                    start: adata.iCREQuery[0].coordinates.start, 
                    end: adata.iCREQuery[0].coordinates.end,
                  }
                }
                assembly={"GRCh38"}
                coordinates={{ start: adata.iCREQuery[0].coordinates.start, end: adata.iCREQuery[0].coordinates.end, chromosome: adata.iCREQuery[0].coordinates.chromosome }}
                defaultcelltypes={adata.iCREQuery[0].celltypes}
              />
              </Grid2>
            }              
            { value===1 && searchParams.get("accession")  && 
              <>
                <Grid2 xs={6} lg={6}>
                  <ATACUMAP accession={searchParams.get("accession") }/>
              </Grid2>
              </>

            }
            { value===2 && ebidata && 
              <Grid2 container>
                    <Grid2 xs={12} lg={12}>
                            <DataTable
                              columns={[
                                {
                                  header: "Chromosome",
                                  value: (row) => row.chromosome,
                                },
                                {
                                  header: "Position",
                                  value: (row) => row.position,
                                },
                                {
                                  header: "Strongest snp risk allele",
                                  value: (row) => row.strongest_snp_risk_allele,
                                },
                                {
                                header: "Risk Allele Frequency",
                                value: (row) => row.risk_allele_frequency,
                                
                              },
                              {
                                header: "P-Value",
                                value: (row) => row.p_value && row.p_value || 0,
                              },
                              {
                                header: "Study",
                                value: (row) => row.study,
                              },
                              {
                                header: "Region",
                                value: (row) => row.region,
                              },
                              {
                                header:"Immu screen trait",
                                value: (row) => row.immu_screen_trait
                              },
                              {
                                header:"mapped_trait",
                                value: (row) => row.mapped_trait
                              },
                              {
                                header: "Pubmed Id",
                                value: (row) => row.pubmedid
                                
                              }
                              
                              ]}
                        tableTitle={`EBI Associations for ${searchParams.get('accession')}:`}
                        rows={ebidata.ebiAssociationsQuery || []}
                        
                        
                        itemsPerPage={10}
                      />
                      </Grid2>
                  </Grid2>
            }
            { value===3 && 
              <Grid2 xs={12} lg={12}>
                <FormControl>
                  <InputLabel id="select-study-label">Study</InputLabel>
                  <Select
                    labelId="select-study-label"
                    id="select-study"
                    value={study}
                    label="Study"
                    onChange={(event: SelectChangeEvent)=>{
                      setStudy(event.target.value as string)
                      if(event.target.value==="Corces" && zscoreValue===1){
                        setzscoreValue(0)
                      }
                    }}
                  >
                    <MenuItem value={'Calderon'}>Calderon</MenuItem>
                    <MenuItem value={'Corces'}>Corces</MenuItem>          
                  </Select>
                </FormControl>
                <br/>
                <br/>
              </Grid2>}
              {  value===3 && 
                 <Grid2 xs={12} lg={12}>
                    <Tabs aria-label="icres_tabs" value={zscoreValue} onChange={handleZscoreChange}>
                        <StyledTab label="By Experiment" />
                        {study==='Calderon' &&<StyledTab label="By Celltype" />}
                    </Tabs>
                  </Grid2>
              }
              { value===3 && zscoreValue===0 && icrezscoredata && icrezscoredata.calderoncorcesAtacQuery.length>0 && barplotdata &&
                <>
                  <Grid2 container>
                    {barplotdata.filter(b=>b.grouping==='Lymphoid') && <Grid2 xs={6} lg={6}>
                      <AtacBarPlot study={study} plottitle="Lymphoid" barplotdata={barplotdata.filter(b=>b.grouping==='Lymphoid')} />
                    </Grid2>}
                    <Grid2 xs={1} lg={1}></Grid2>
                    {barplotdata.filter(b=>b.grouping==='Myeloid') && <Grid2 xs={5} lg={5}>
                      <AtacBarPlot  study={study} plottitle="Myeloid"  barplotdata={barplotdata.filter(b=>b.grouping==='Myeloid')}/>
                    </Grid2>}
                  </Grid2>
                  { study==='Corces' && 
                    <Grid2 container>
                      {barplotdata.filter(b=>b.grouping==='Leukemic') && <Grid2 xs={6} lg={6}>
                        <AtacBarPlot study={study}  plottitle="Leukemic"  barplotdata={barplotdata.filter(b=>b.grouping==='Leukemic')}/>
                      </Grid2>}
                      <Grid2 xs={1} lg={1}></Grid2>
                      {barplotdata.filter(b=>b.grouping==='Progenitors') && <Grid2 xs={5} lg={5}>
                        <AtacBarPlot study={study}  plottitle="Progenitors"  barplotdata={barplotdata.filter(b=>b.grouping==='Progenitors')} />
                      </Grid2>}
                    </Grid2>
                  }
                </>
              }
              {
                value===3 && zscoreValue===1 && icrebyctzscoredata && icrebyctzscoredata.calderoncorcesByCtAtacQuery.length>0 && barplotbyctdata &&                
                <Grid2 container>
                  <Grid2 xs={12} lg={12}>
                    <AtacBarPlot study={study} barplotdata={barplotbyctdata} byct />
                  </Grid2>
                </Grid2>
              }
              
      </Grid2>
    </main>
  )
}

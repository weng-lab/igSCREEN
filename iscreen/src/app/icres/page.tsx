"use client"
import React, {useState} from "react"
import { useRouter } from "next/navigation"

import { StyledTab } from "../../common/utils"
import { client } from "../../common/utils"
import SearchIcon from "@mui/icons-material/Search"
import { Typography } from "@mui/material"
import { Tabs } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { TextField, IconButton, InputAdornment,  createTheme } from "@mui/material"
import { FormControl, MenuItem } from "@mui/material"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ReadonlyURLSearchParams, useSearchParams} from "next/navigation"
import { GenomeBrowserView } from "../../common/gbview/genomebrowserview"
import { CcreAutoComplete } from "../../common/components/mainsearch/CcreAutocomplete"
import { DataTable } from "@weng-lab/psychscreen-ui-components"

const ICRES_QUERY = gql`
query iCREQuery($coordinates: [GenomicRangeInput!]) 
  {
    iCREQuery(coordinates:$coordinates) {
      rdhs
      accession
      celltypes
      coordinates {
        start
        end
        chromosome
      }
      }
  }

`

//Need better text styling

export default function Icres() {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()!
  const [value, setValue] = useState(0)
  const router = useRouter()
  const [searchvalue, setSearchValue] = useState("")
  const [selectedPortal, setSelectedPortal] = useState<string>("Genomic Region");
  const handleSelectedPortal = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };
  const { loading: loading, data: data } = useQuery(ICRES_QUERY, {
    variables: {
      coordinates : {
        chromosome : searchParams.get("chromosome"),
        start : +searchParams.get("start"),
        end : +searchParams.get("end")
      }
    },
    skip: !searchParams.get("chromosome"),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })
  const handleChange = (_, newValue: number) => {
    setValue(newValue)
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


  return !searchParams.get('accession') && !searchParams.get('chromosome') ?  (
  <main>
    <Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
  <Grid2 xs={6} sx={{ mt: "5em", ml:"2em"}}>
    <Typography variant="h3">iCRE Portal</Typography>
    
    <br/>
    <FormControl variant="standard">
      <Select
        id="portal-select"
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
    {selectedPortal==="Genomic Region" ?  <TextField
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
            /> : <CcreAutoComplete textColor={"black"} assembly={"GRCh38"}/> }
  </Grid2>
 
</Grid2>
</main>): searchParams.get('chromosome') ? (
    <main>
      <Grid2 container  sx={{ maxWidth: "80%", mr: "auto", ml: "auto", mt: "1rem" }}>
   
            <Grid2 container sx={{  ml:"0.5em", mt: "4rem", mb: "2rem" }}>
            <Grid2 xs={12} lg={12}>
            {searchParams.get("chromosome") && <Typography variant="h5">{`Showing immune Candidate cis-Regulatory Elements (cCREs) in the region ${searchParams.get('chromosome')}:${searchParams.get('start')}-${searchParams.get('end')}`}</Typography>}
            </Grid2>
            <Grid2 xs={12} lg={12}>
                <Tabs aria-label="icres_region_tabs" value={value} onChange={handleChange}>
                    <StyledTab label="Table View" />
                    
                </Tabs>
                </Grid2>
            </Grid2>
           
            {value===0 && !loading &&<DataTable
                              columns={[
                                
                                {
                                  header: "Accession",
                                  value: (row) => row.accession ,
                                  
                                },
                                {
                                  header: "rDHS",
                                  value: (row) => row.rdhs,
                                },
                                
                              {
                                header: "Chromosome",
                                value: (row) => row.coordinates.chromosome || "",
                                
                              },
                              {
                                header: "Start",
                                value: (row) => row.coordinates.start || "",
                                
                              },
                              {
                                header: "End",
                                value: (row) => row.coordinates.end || "",
                                
                              },
                              {
                                header: "Celltypes",
                                value: (row) => row.celltypes.join(","),
                              }
                              ]}
                        tableTitle={`iCREs`}
                        rows={(data.iCREQuery) || []}
                        
                        sortColumn={3}
                        itemsPerPage={10}
                      />}
        </Grid2>
       
      
    </main>
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
                    
                </Tabs>
                </Grid2>
            </Grid2>
           
            {value===0 && <GenomeBrowserView                
                
                assembly={"GRCh38"}
                coordinates={{ start: 520000, end: 580000, chromosome:"chr11" }}
              />}
        </Grid2>
       
      
    </main>
  )
}

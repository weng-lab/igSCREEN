//Home Page

"use client"
import { FormControl, MenuItem, Typography } from "@mui/material"
import React, { useState} from "react"

import Select, { SelectChangeEvent } from "@mui/material/Select";
// Grid v2 isn't declared stable yet, but using it now as it's what MUI is currently developing out
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { GeneAutoComplete } from "../common/components/mainsearch/GeneAutocomplete";
import { SnpAutoComplete } from "../common/components/mainsearch/SnpAutocomplete";
import {CcreAutoComplete} from  "../common/components/mainsearch/CcreAutocomplete";

 const Home = () => {
  const [selectedPortal, setSelectedPortal] = useState<string>("Genes");
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };

  return (
    <main>
      {/* May need to rethink where these margins are set. Which element should be setting content width? */}
      <Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
        <Grid2 xs={6} sx={{ mt: "5em", ml:"2em"}}>
          <Typography variant="h3">immuSCREEN</Typography>
          <Typography variant="h5">Search immune Candidate cis-Regulatory Elements by ENCODE</Typography>
          <br/>
          <FormControl variant="standard">
            <Select
              id="portal-select"
              value={selectedPortal}
              // defaultValue={10}
              onChange={handleChange}
            >
              <MenuItem value={"Genes"}>Genes</MenuItem>
              <MenuItem value={"SNPs"}>SNPs</MenuItem>
              <MenuItem value={"iCREs"}>iCREs</MenuItem>
            </Select>
          </FormControl>
          <br/>
          <br/>
          {selectedPortal==="Genes" ? <GeneAutoComplete textColor={"black"} assembly={"GRCh38"} /> : selectedPortal==="SNPs" ?
           <SnpAutoComplete textColor={"black"} assembly={"GRCh38"} /> : <CcreAutoComplete textColor={"black"} assembly={"GRCh38"}/> }
        </Grid2>
       
      </Grid2>
    </main>
  )
}

export default Home;
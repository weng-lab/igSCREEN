"use client"
import React from "react"
import { Typography } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"



//Need better text styling

export default function About() {
  return (
    <main>
      <Grid2 container spacing={4} sx={{ maxWidth: "70%", mr: "auto", ml: "auto", mt: "3rem" }}>
        <Grid2 xs={12} lg={6}>
          <Typography variant="h3">About iSCREEN</Typography>
          <Typography variant="h5">Search immune Candidate cis-Regulatory Elements by ENCODE</Typography>
         
        </Grid2>       
       
      </Grid2>
    </main>
  )
}

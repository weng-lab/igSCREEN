"use client"
import React from "react"
import { Typography } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

export default function About() {
  return (
    <main>
      <Grid2 container spacing={4} sx={{ maxWidth: "70%", mr: "auto", ml: "auto", mt: "3rem" }}>
        <Grid2 xs={12}>
          <Typography paragraph variant="h3">About igSCREEN</Typography>
          <Typography paragraph variant="h5">Search <i>immune</i> Candidate cis-Regulatory Elements</Typography>
          <Typography paragraph>igSCREEN is a comprehensive catalog of multi-omic knowledge about human immune cells. It was designed and built by Dr. Zhiping Weng’s and Dr. Jill Moore’s labs at UMass Chan Medical School.</Typography>
          <Typography paragraph>For questions or comments please contact us at Zhiping.Weng@umassmed.edu and Jill.Moore@umassmed.edu</Typography>
          <Typography paragraph>This work is supported by U01AI173584.</Typography>
        </Grid2>
      </Grid2>
    </main>
  )
}

"use client"
import { Typography, Box } from "@mui/material"
import MuiLink from "@mui/material/Link"

export default function Footer() {
  return (
    <Box id="Footer" sx={{
      position: "absolute", bottom: "0", textAlign: "center", width: "100%", height: "3rem",
      backgroundColor: theme => theme.palette.primary.main
    }}>
      <br />

      <Typography variant="body2" color="#ffffff">
        {"Copyright © "}
        <MuiLink color="inherit" href="https://www.umassmed.edu/zlab/">
          Weng Lab
        </MuiLink>
        {", "}
        <MuiLink color="inherit" href="https://www.moore-lab.org/">
          Moore Lab
        </MuiLink>{" "}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  )
}

"use client"
import { Typography, Container, Box } from "@mui/material"
import { defaultTheme } from "../lib/themes"
import MuiLink from "@mui/material/Link"
import { ThemeProvider } from "@mui/material/styles"

export default function Footer() {
  return (
    <ThemeProvider theme={defaultTheme}>
        <Box id="Footer"  sx={{ position: "absolute", bottom: "0", textAlign: "center", width: "100%", height: "3rem",
         backgroundColor: defaultTheme.palette.primary.main}}>
          <br/>
          
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
    </ThemeProvider>
  )
}

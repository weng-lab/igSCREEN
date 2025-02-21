'use client'
import { createTheme } from "@mui/material/styles"

// temp theme for toolbar color and accordion outline - UMass blue / empty secondary
export const defaultTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#494d6b",
      contrastText: "#FFFFFF",
    },
  },
})

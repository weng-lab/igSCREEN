'use client'
import { createTheme } from "@mui/material/styles"

// temp theme for toolbar color and accordion outline - UMass blue / empty secondary
export const defaultTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      // main: "#000F9F",
      main: "#494d6b",
      contrastText: "#FFFFFF",
    },
  },
  components: {
    MuiAccordion: {
      defaultProps: {
        elevation: 0, // outline
      },
    },
  },
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
})

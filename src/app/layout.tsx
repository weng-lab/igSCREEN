import AppBar from "../common/components/HomeAppBar"
import Footer from "../common/components/Footer"
import { Box, CssBaseline, Stack, Toolbar } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ApolloWrapper } from "common/apollo/apollo-wrapper"
import { Suspense } from "react"

export const metadata = {
  title: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
  description: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{height: '100%'}}>
      <body style={{height: '100%'}}>
        <Suspense>
          <ApolloWrapper>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar />
                <Stack justifyContent={"space-between"} minHeight={"100vh"} height={'100%'}>
                  <Toolbar /> {/* used to bump content below header */}
                  <Box flexGrow={1}>
                    {children}
                  </Box>
                  <Footer />
                </Stack>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </ApolloWrapper>
        </Suspense>
      </body>
    </html>
  )
}

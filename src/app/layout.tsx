import ClientAppWrapper from "common/components/ClientAppWrapper"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ApolloWrapper } from "common/apollo/apollo-wrapper"
import { Suspense } from "react"
import MuiXLicense from "common/MuiXLicense";
import { OpenElementsContextProvider } from "common/OpenElementsContext";
import { Analytics } from "@vercel/analytics/next"
import { MenuControlProvider } from "common/MenuContext";

export const metadata = {
  title: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
  description: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <ApolloWrapper>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <MenuControlProvider>
                  <OpenElementsContextProvider>
                    <ClientAppWrapper>{children}</ClientAppWrapper>
                  </OpenElementsContextProvider>
                </MenuControlProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </ApolloWrapper>
        </Suspense>
        <CssBaseline />
        <MuiXLicense />
        <Analytics />
      </body>
    </html>
  );
}

import "./globals.css"
import { Inter } from "next/font/google"
import AppBar from "../common/components/HomeAppBar"
import Footer from "../common/components/Footer"
import { Suspense } from "react"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "../common/lib/themes"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
  description: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} id="page-container">
        <Suspense>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <div id="content-wrapper">
                <CssBaseline />
                <AppBar />
                <div id="body-wrapper">{children}</div>
              </div>
              <Footer />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html>
  )
}

import "./globals.css"
import { Inter } from "next/font/google"
import AppBar from "../common/components/HomeAppBar"
import Footer from "../common/components/Footer"
import { Suspense } from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { defaultTheme } from "../common/lib/themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
  description: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} id="page-container">
        <div id="content-wrapper">
          <CssBaseline />
          <AppBar />
          <Suspense>
            <div id="body-wrapper">{children}</div>
          </Suspense>
        </div>
        <Footer />
      </body>
    </html>
  )
}

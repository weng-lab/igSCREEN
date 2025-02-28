'use client'

import { NavigateNext } from "@mui/icons-material"
import { Breadcrumbs, Typography } from "@mui/material"
import MuiLink from "common/components/MuiLink"
import { usePathname } from "next/navigation"

const ElementDetailsBreadcrumbs = () => {
  const pathname = usePathname()
  const links = pathname.split('/').slice(1,3)

  const formatPortal = (subpath: string) => {
    switch(subpath){
      case ("snp"): return "SNP"
      case ("gene"): return "Gene"
      case ("icre"): return "iCRE"
      default: return subpath
    }
  }

  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumbs"
    >
      <MuiLink underline="hover" key="1" color="inherit" href="/">
        Home
      </MuiLink>
      {links.map((subpath, i) => {
        if (i === 0) {
          return (
            <MuiLink underline="hover" color="inherit" href="/snp/">
              {formatPortal(subpath)}
            </MuiLink>
          )
        } else return (
          <Typography>
            {subpath}
          </Typography>
        )
      })}
    </Breadcrumbs>
  )
}

export default ElementDetailsBreadcrumbs
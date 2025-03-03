'use client'

import { NavigateNext } from "@mui/icons-material"
import { Breadcrumbs, Typography } from "@mui/material"
import MuiLink from "common/components/MuiLink"
import { formatPortal } from "common/utility"
import { usePathname } from "next/navigation"

const ElementDetailsBreadcrumbs = () => {
  const pathname = usePathname()
  const links = pathname.split('/').slice(1,3)

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
            <MuiLink underline="hover" color="inherit" href={"/" + subpath} key={subpath}>
              {formatPortal(subpath)}
            </MuiLink>
          )
        } else return (
          <Typography key={subpath}>
            {subpath}
          </Typography>
        )
      })}
    </Breadcrumbs>
  )
}

export default ElementDetailsBreadcrumbs
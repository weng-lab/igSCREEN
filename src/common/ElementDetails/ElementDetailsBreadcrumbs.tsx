'use client'

import { NavigateNext } from "@mui/icons-material"
import { Breadcrumbs, Typography } from "@mui/material"
import { LinkComponent } from "common/components/LinkComponent"
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
      <LinkComponent color="inherit" href="/">
        Home
      </LinkComponent>
      {links.map((subpath, i) => {
        if (i === 0) {
          return (
            <LinkComponent color="inherit" href={"/" + subpath} key={subpath}>
              {formatPortal(subpath)}
            </LinkComponent>
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
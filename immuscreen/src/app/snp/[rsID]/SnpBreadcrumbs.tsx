import { NavigateNext } from "@mui/icons-material"
import { Breadcrumbs, Typography } from "@mui/material"
import MuiLink from "common/components/MuiLink"

/**
 * This component could be made generic for all details pages assuming they all have the same routing depth.
 * Look into to reduce duplication
 */

const SnpBreadcrumbs = (props: { rsID: string }) => {
  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumbs"
    >
      <MuiLink underline="hover" key="1" color="inherit" href="/">
        Home
      </MuiLink>
      <MuiLink underline="hover" color="inherit" href="/snp/">
        SNP
      </MuiLink>
      <Typography>
        {props.rsID}
      </Typography>
    </Breadcrumbs>
  )
}

export default SnpBreadcrumbs
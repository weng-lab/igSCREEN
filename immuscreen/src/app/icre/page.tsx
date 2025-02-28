"use client"
import { Stack,  Typography } from "@mui/material"
import { SnpAutoComplete } from "../../common/components/mainsearch/SnpAutocomplete"
import { CcreAutoComplete } from "common/components/mainsearch/CcreAutocomplete"


const ICRE = () => {
  return (
    <Stack sx={{ p: 4, gap: 4 }}>
      <Typography variant="h3">iCRE Portal</Typography>
      <CcreAutoComplete textColor={"black"} assembly={"GRCh38"} />
    </Stack>
  )
}

export default ICRE;
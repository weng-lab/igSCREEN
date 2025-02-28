"use client"
import { Stack,  Typography } from "@mui/material"
import { SnpAutoComplete } from "../../common/components/mainsearch/SnpAutocomplete"


const Snp = () => {
  return (
    <Stack sx={{ p: 4, gap: 4 }}>
      <Typography variant="h3">SNP Portal</Typography>
      <SnpAutoComplete assembly={"GRCh38"} />
    </Stack>
  )
}

export default Snp;
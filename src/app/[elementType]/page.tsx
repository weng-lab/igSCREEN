'use client'
import { Stack, Typography } from "@mui/material";
import { GenomeSearch, Result } from "@weng-lab/psychscreen-ui-components";
import { formatPortal } from "common/utility";
import { useRouter } from "next/navigation";
import { isValidGenomicElement } from "types/globalTypes";

export default function PortalPage({ params: {elementType} }: { params: { elementType: string } }) {

  if (!isValidGenomicElement(elementType)) {
    throw new Error("Unknown genomic element type: " + elementType)
  }

  const router = useRouter()
    
  /**
   * The tab that this ends up directing to is configured in next.config.mjs
   */
  const handleSearchSubmit = (result: Result) => {
    router.push(result.type + "/" + result.title)
  }

  return (
    <Stack sx={{ p: 4, gap: 4 }}>
      <Typography variant="h3">{formatPortal(elementType)} Portal</Typography>
      <GenomeSearch
        assembly="GRCh38"
        onSearchSubmit={handleSearchSubmit}
        queries={[elementType]}
        fullWidth
      />
    </Stack>
  )
}
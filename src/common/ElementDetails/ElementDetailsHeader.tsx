import { Box, Button, Skeleton, Stack, Typography } from "@mui/material"
import { useElementMetadata } from "common/hooks/useElementMetadata"
import { formatPortal } from "common/utility"
import { GenomicElementType } from "types/globalTypes"
import Image from "next/image"
import Grid2 from "@mui/material/Grid2";

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType
  elementID: string
}

const ElementDetailsHeader = ({ elementType, elementID }: ElementDetailsHeaderProps) => {

  const { data: elementMetadata, loading, error } = useElementMetadata({ elementType, elementID })

  console.log(elementMetadata)

  const c = elementMetadata?.coordinates
  const coordinatesDisplay = c && `${c.chromosome}:${c.start.toLocaleString()}-${c.end.toLocaleString()}`

  return (
    <Stack
      sx={{ p: 1 }}
      border={theme => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
    >
      <Stack>
        <Typography variant="subtitle1">
          {formatPortal(elementType)} Details
        </Typography>
        <Typography variant='h4'>
          {elementID}
        </Typography>
        <Typography>
          {loading ? <Skeleton width={215} /> : coordinatesDisplay}
        </Typography>
      </Stack>
      <Grid2 container>
        <Grid2 size={6}>
        <Button
          variant="contained"
          href={elementID ? "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + elementID : undefined}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ minWidth: 125, minHeight: 50, backgroundColor: "white" }}
        >
          <Image style={{ objectFit: "contain" }} src="https://geneanalytics.genecards.org/media/81632/gc.png" fill alt="gene-card-button" />
        </Button>
        </Grid2>
        <Button
          variant="contained"
          href={elementID ? "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + elementID : undefined}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ minWidth: 125, minHeight: 50, backgroundColor: "white" }}
        >
          <Image style={{ objectFit: "contain" }} src="https://geneanalytics.genecards.org/media/81632/gc.png" fill alt="gene-card-button" />
        </Button>
      </Grid2>
    </Stack>
  )
}

export default ElementDetailsHeader
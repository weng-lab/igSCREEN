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
      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <Button
            variant="contained"
            href={elementID ? `http://screen.wenglab.org/search/?q=${elementID}&uuid=0&assembly=GRCh38` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ minWidth: 125, height: "100%", backgroundColor: "white" }}
          >
            <Image style={{ objectFit: "contain", padding: 4 }} src="/SCREEN_logo_light_large.png" fill alt="screen-card-button" />
          </Button>
        </Grid2>
        <Grid2 size={6} display={elementType === "icre" && "none"}>
          <Button
            variant="contained"
            href={
              elementID ?
              elementType === "gene" ?
              "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + elementID 
              : `https://www.ncbi.nlm.nih.gov/snp/${elementID}`
              : undefined}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ minWidth: 125, height: "100%", backgroundColor: "white" }}
          >
            <Image style={{ objectFit: "contain" }} src={elementType === "gene" ? "https://geneanalytics.genecards.org/media/81632/gc.png" : "https://www.ncbi.nlm.nih.gov/core/assets/style-guide/img/NLM-square-logo.png"} fill alt="genecard-snpcard-button" />
          </Button>
        </Grid2>
      </Grid2>
    </Stack>
  )
}

export default ElementDetailsHeader
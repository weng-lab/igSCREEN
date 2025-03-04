import { Box, Skeleton, Typography } from "@mui/material"
import { useElementMetadata } from "common/hooks/useElementMetadata"
import { formatPortal } from "common/utility"
import { GenomicElementType } from "types/globalTypes"

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType
  elementID: string
}

const ElementDetailsHeader = ({elementType, elementID}: ElementDetailsHeaderProps) => {

  const {data: elementMetadata, loading, error} = useElementMetadata({elementType, elementID})

  const c = elementMetadata?.coordinates
  const coordinatesDisplay = c && `${c.chromosome}:${c.start.toLocaleString()}-${c.end.toLocaleString()}`

  return (
    <Box
      sx={{p: 1}}
      border={theme => `1px solid ${theme.palette.divider}`}
      borderRadius={2}
    >
      <Typography variant="subtitle1">
        {formatPortal(elementType)} Details
      </Typography>
      <Typography variant='h4'>
        {elementID}
      </Typography>
      <Typography>
        {loading ? <Skeleton width={215} /> : coordinatesDisplay}
      </Typography>
    </Box>
  )
}

export default ElementDetailsHeader
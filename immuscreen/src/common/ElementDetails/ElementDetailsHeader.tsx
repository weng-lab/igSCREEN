import { Box, Typography } from "@mui/material"
import { formatPortal } from "common/utility"
import { GenomicElementType } from "types/globalTypes"

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType
  elementID: string
}

const ElementDetailsHeader = ({elementType, elementID}: ElementDetailsHeaderProps) => {

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
    </Box>
  )
}

export default ElementDetailsHeader
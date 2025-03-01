import { Box, Typography } from "@mui/material"
import { PortalType } from "types/globalTypes"

export type ElementDetailsHeaderProps = {
  elementType: PortalType
  elementName: string
}

const ElementDetailsHeader = ({elementType, elementName}: ElementDetailsHeaderProps) => {

  return (
    <Box
      sx={{p: 1}}
      border={theme => `1px solid ${theme.palette.divider}`}
      borderRadius={2}
    >
      <Typography variant="subtitle1">
        {elementType} Details
      </Typography>
      <Typography variant='h4'>
        {elementName}
      </Typography>
    </Box>
  )
}

export default ElementDetailsHeader
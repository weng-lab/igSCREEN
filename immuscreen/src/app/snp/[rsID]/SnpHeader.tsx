import { Box, Typography } from "@mui/material"

const SnpHeader = ({rsID}: {rsID: string}) => {

  return (
    <Box
      sx={{p: 1}}
      border={theme => `1px solid ${theme.palette.divider}`}
      borderRadius={2}
    >
      <Typography variant="subtitle1">
        SNP Details
      </Typography>
      <Typography variant='h4'>
        {rsID}
      </Typography>
    </Box>
  )
}

export default SnpHeader
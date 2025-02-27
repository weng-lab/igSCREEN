import { Box, Typography } from '@mui/material';
import SnpDetailsTabs from './SnpDetailsTabs';

export default function RegionSearchLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { rsID: string }
}) {

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{mb: 1}}>
          {`${params.rsID} details`}
        </Typography>
        <SnpDetailsTabs />
      </Box>
      <main>{children}</main>
    </Box>
  )
}
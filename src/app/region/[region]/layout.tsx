import { Box, Stack, Typography } from '@mui/material';
import RegionSearchTabs from './RegionSearchTabs';
import { parseGenomicRangeString } from 'common/utility';

export default function RegionSearchLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { region: string }
}) {
  
  const region = parseGenomicRangeString(params.region)

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{mb: 1}}>
          {`Searching ${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`}
        </Typography>
        <RegionSearchTabs />
      </Box>
      <main>{children}</main>
    </Box>
  )
}
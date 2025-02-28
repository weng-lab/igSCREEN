'use client'

import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import SnpDetailsTabs from './SnpDetailsTabs';
import SnpHeader from './SnpHeader';
import SnpBreadcrumbs from './SnpBreadcrumbs';

export default function RegionSearchLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { rsID: string }
}) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Stack height={'100%'} direction={ isDesktop ? 'row' : 'column' }>
      {/* Tabs */}
      <Box order={isDesktop ? 1 : 2}>
        <SnpDetailsTabs />
        {!isDesktop && children}
      </Box>
      {/* Title */}
      <Stack order={isDesktop ? 2 : 1} sx={{gap: 2, m: 2}}>
        <SnpBreadcrumbs rsID={params.rsID} />
        <SnpHeader rsID={params.rsID} />
        {isDesktop && children}
      </Stack>
    </Stack>
  )
}
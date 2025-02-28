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

  const spaceBetween = 2

  return (
    <Stack height={'100%'} direction={ isDesktop ? 'row' : 'column' }>
      {/* Tabs */}
      <Stack order={isDesktop ? 1 : 2} sx={!isDesktop && {gap: spaceBetween, m: spaceBetween}}>
        <SnpDetailsTabs />
        {!isDesktop && children}
      </Stack>
      {/* Header */}
      <Stack order={isDesktop ? 2 : 1} sx={{gap: spaceBetween, p: spaceBetween, width: '100%'}}>
        <SnpBreadcrumbs rsID={params.rsID} />
        <SnpHeader rsID={params.rsID} />
        {isDesktop && children}
      </Stack>
    </Stack>
  )
}
'use client'

import { Stack, useMediaQuery, useTheme } from '@mui/material';
import ElementDetailsTabs from './ElementDetailsTabs';
import ElementDetailsBreadcrumbs from './ElementDetailsBreadcrumbs';
import ElementDetailsHeader from './ElementDetailsHeader';

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
    <Stack height={'100%'} direction={isDesktop ? 'row' : 'column'}>
      {/* Tabs */}
      <Stack order={isDesktop ? 1 : 2} sx={!isDesktop && { gap: spaceBetween, m: spaceBetween }}>
        <ElementDetailsTabs
          tabs={[
            {
              label: 'eQTLs',
              href: 'eQTLs'
            },
            {
              label: 'Nearby Genomic Features',
              href: 'nearby'
            },
          ]}
        />
        {!isDesktop && children}
      </Stack>
      {/* Header */}
      <Stack order={isDesktop ? 2 : 1} sx={{ gap: spaceBetween, p: spaceBetween, width: '100%' }}>
        <ElementDetailsBreadcrumbs />
        <ElementDetailsHeader elementName={params.rsID} elementType='SNP' />
        {isDesktop && children}
      </Stack>
    </Stack>
  )
}
'use client'

import { Stack, useMediaQuery, useTheme } from '@mui/material';
import ElementDetailsBreadcrumbs from './ElementDetailsBreadcrumbs';
import ElementDetailsTabs, { ElementDetailsTabsProps } from './ElementDetailsTabs';
import ElementDetailsHeader, { ElementDetailsHeaderProps } from './ElementDetailsHeader';

export type ElementDetailsLayoutProps = ElementDetailsTabsProps & ElementDetailsHeaderProps & {children: React.ReactNode}

export default function ElementDetailsLayout({tabs, elementName, elementType, children}: ElementDetailsLayoutProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const spaceBetween = 2

  return (
    <Stack height={'100%'} direction={isDesktop ? 'row' : 'column'}>
      {/* Tabs */}
      <Stack order={isDesktop ? 1 : 2} sx={!isDesktop && { gap: spaceBetween, m: spaceBetween }}>
        <ElementDetailsTabs tabs={tabs} />
        {!isDesktop && children}
      </Stack>
      {/* Header */}
      <Stack order={isDesktop ? 2 : 1} sx={{ gap: spaceBetween, p: spaceBetween, width: '100%' }}>
        <ElementDetailsBreadcrumbs />
        <ElementDetailsHeader elementName={elementName} elementType={elementType} />
        {isDesktop && children}
      </Stack>
    </Stack>
  )
}
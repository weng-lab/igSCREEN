'use client'
import { Box, Stack } from '@mui/material';
import ElementDetailsBreadcrumbs from './ElementDetailsBreadcrumbs';
import ElementDetailsTabs from './ElementDetailsTabs';
import ElementDetailsHeader, { ElementDetailsHeaderProps } from './ElementDetailsHeader';

export type ElementDetailsLayoutProps = ElementDetailsHeaderProps & {children: React.ReactNode}

export default function ElementDetailsLayout({elementID, elementType, children}: ElementDetailsLayoutProps) {
  const spaceBetween = 2

  return (
    <Stack height={'100%'} width={'100%'} direction={"row"}>
      {/* Tabs, shown only on desktop */}
      <Box sx={{display: {xs: "none", md: "initial"}}}>
        <ElementDetailsTabs elementType={elementType} orientation='vertical' />
      </Box>
      <Stack sx={{ flexGrow: 1, p: spaceBetween, overflow: 'auto' }} spacing={spaceBetween} id={"main_content_container"}>
        <ElementDetailsBreadcrumbs />
        <ElementDetailsHeader elementType={elementType} elementID={elementID} />
        {/* Tabs, shown only on mobile */}
        <Box sx={{ display: { xs: "initial", md: "none" }, borderBottom: 1, borderColor: 'divider' }}>
          <ElementDetailsTabs elementType={elementType} orientation='horizontal' />
        </Box>
        {children}
      </Stack>
    </Stack>
  )
}
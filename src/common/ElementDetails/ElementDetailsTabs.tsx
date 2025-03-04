'use client'

import { Box, Tabs, Tab, useMediaQuery, useTheme, Typography, Divider } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { ElementDetailsTab, GenePortalTab, GenomicElementType, IcrePortalTab, SnpPortalTab } from "types/globalTypes";
import { genePortalTabs, icrePortalTabs, sharedTabs, snpPortalTabs } from "./tabsConfig";

export type ElementDetailsTabsProps = {
  elementType: GenomicElementType
}

const ElementDetailsTabs = ({ elementType }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1);
  const basepath = pathname.substring(0, pathname.lastIndexOf('/'));

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [value, setValue] = React.useState(currentTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  //If we ever use parallel routes, this will probably break
  useEffect(() => {
    if (currentTab !== value) {
      setValue(currentTab)
    }
  }, [currentTab, value])

  const tabs: ElementDetailsTab[] = useMemo(() => {
    let elementSpecificTabs: SnpPortalTab[] | GenePortalTab[] | IcrePortalTab[];
    switch (elementType) {
      case ("gene"):
        elementSpecificTabs = genePortalTabs
        break
      case ("snp"):
        elementSpecificTabs = snpPortalTabs
        break
      case ("icre"):
        elementSpecificTabs = icrePortalTabs
        break
    }
    return [
      ...sharedTabs,
      ...elementSpecificTabs
    ]
  }, [elementType])

  return (
    <Box
      sx={{
        width: isDesktop ? '250px' : "100%", //clamp width on desktop
        p: isDesktop ? 2 : 0,
        background: isDesktop && '#F2F2F2',
        height: isDesktop ? '100%' : 'inherit'
      }}
    >
      {isDesktop &&
        <Box sx={{mb: 1}}>
          <Typography variant="h6">
            Contents
          </Typography>
          <Divider />
        </Box>
      }
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="SNP Details Tabs"
        orientation={isDesktop ? 'vertical' : 'horizontal'}
        variant="scrollable"
        scrollButtons="auto"
        sx={
          isDesktop && {
            '& .MuiTab-root': {
              alignItems: 'flex-start',
              paddingLeft: 0
            }
          }
        }
      >
        {tabs.map((tab) => 
          <Tab
            label={tab.label}
            value={tab.href}
            LinkComponent={Link}
            href={basepath + '/' + tab.href}
            key={tab.href}
          />
        )}
      </Tabs>
    </Box>
  )
}

export default ElementDetailsTabs
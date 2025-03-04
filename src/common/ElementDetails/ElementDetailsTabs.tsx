'use client'

import { Box, Tabs, Tab, useMediaQuery, useTheme, Typography, Divider } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { ElementDetailsTab, GenePortalTab, GenomicElementType, IcrePortalTab, SnpPortalTab } from "types/globalTypes";
import { genePortalTabs, icrePortalTabs, sharedTabs, snpPortalTabs } from "./tabsConfig";

export type ElementDetailsTabsProps = {
  elementType: GenomicElementType
  orientation: "horizontal" | "vertical"
}

const ElementDetailsTabs = ({ elementType, orientation }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1);
  const basepath = pathname.substring(0, pathname.lastIndexOf('/'));

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

  const horizontalTabs = orientation === "horizontal"

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '250px' }, //clamp width on desktop
        p: { md: 2 },
        background: { md: '#F2F2F2' },
        height: { md: '100%'}
      }}
    >
      <Box sx={{display: {xs: 'none', md: 'initial'}, mb: {xs: 0, md: 1}}}>
        <Typography variant="h6">
          Contents
        </Typography>
        <Divider />
      </Box>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="SNP Details Tabs"
        orientation={orientation}
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons={horizontalTabs ? true : "auto"}
        sx={{
          '& .MuiTab-root': {
            alignItems: { md: 'flex-start' },
            paddingLeft: { md: 0 }
          },
          '& .MuiTabs-scrollButtons.Mui-disabled': {
            opacity: 0.3
          }
        }}
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
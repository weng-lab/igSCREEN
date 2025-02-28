'use client'

import { Box, Tabs, Tab, useMediaQuery, useTheme, Typography, Divider } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const SnpDetailsTabs = () => {
  const pathname = usePathname();
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1);
  const basepath = pathname.substring(0, pathname.lastIndexOf('/'));

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [value, setValue] = React.useState(currentTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (currentTab !== value) {
      setValue(currentTab)
    }
  }, [currentTab, value])

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
        <>
          <Typography variant="h6">
            Contents
          </Typography>
          <Divider />
        </>
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
        <Tab
          label="eQTLs"
          value="eQTLs"
          LinkComponent={Link}
          href={basepath + '/' + 'eQTLs'}
        />
        <Tab
          label="Nearby Genomic Features"
          value="nearby"
          LinkComponent={Link}
          href={basepath + '/' + 'nearby'}
        />
      </Tabs>
    </Box>
  )
}

export default SnpDetailsTabs
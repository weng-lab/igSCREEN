'use client'

import { Box, Tabs, Tab, useMediaQuery, useTheme, Typography, Divider, Stack, IconButton, Drawer, Theme, CSSObject, styled } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { ElementDetailsTab, GenePortalTab, GenomicElementType, IcrePortalTab, SnpPortalTab } from "types/globalTypes";
import { genePortalTabs, icrePortalTabs, sharedTabs, snpPortalTabs } from "./tabsConfig";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import SquareIcon from '@mui/icons-material/Square';

export type ElementDetailsTabsProps = {
  elementType: GenomicElementType
  orientation: "horizontal" | "vertical"
}

const drawerWidth =  250;

  const openedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 15px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 15px)`,
    },
  });

  const MiniDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
      height: "100%",
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      position: 'static',
      '& .MuiDrawer-paper': {
        [theme.breakpoints.up('md')]: {
          backgroundColor: '#F2F2F2',
        },
        border: 'none',
        zIndex: theme.zIndex.appBar - 1,
      },
      variants: [
        {
          props: ({ open }) => open,
          style: {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
              ...openedMixin(theme),
              position: 'relative',
            },
          },
        },
        {
          props: ({ open }) => !open,
          style: {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
              ...closedMixin(theme),
              position: 'relative',
            },
          },
        },
      ],
    }),
  );

const ElementDetailsTabs = ({ elementType, orientation }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1);
  const basepath = pathname.substring(0, pathname.lastIndexOf('/'));

  const [value, setValue] = React.useState(currentTab);
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
    <MiniDrawer variant="permanent" open={open || horizontalTabs} sx={{width: horizontalTabs ? "100%" : drawerWidth}}>
      <Box>
        <Stack display={horizontalTabs ? "none" : "flex"} direction={"row"} justifyContent={open ? "space-between" : "center"} alignItems={"center"} mt={2}>
          <Typography variant="h6" sx={[!open && { display: 'none' },]} ml={2}>
            Contents
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={[
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClose}
            sx={[
              { display: !open ? 'none' : "flex"},
            ]}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Stack>
        <Divider variant="middle" />
      </Box>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="SNP Details Tabs"
        orientation={orientation}
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons={horizontalTabs ? true : false}
        sx={{
          '& .MuiTab-root': {
            alignItems: open ? 'flex-start' : 'center',
            paddingLeft: open ? 2 : 0,
          },
          '& .MuiTabs-scrollButtons.Mui-disabled': {
            opacity: 0.3
          }
        }}
      >
        {tabs.map((tab, index) =>
          <Tab
            label={tab.label}
            value={tab.href}
            LinkComponent={Link}
            href={basepath + '/' + tab.href}
            key={tab.href}
            icon={!open && (index % 2 === 0 ? <CropSquareIcon sx={{ fontSize: 40 }} /> : <SquareIcon sx={{ fontSize: 40 }} />)}
            sx={{ mb: !open ? 2 : 0 }}
          />
        )}
      </Tabs>
    </MiniDrawer>
  )
}

export default ElementDetailsTabs
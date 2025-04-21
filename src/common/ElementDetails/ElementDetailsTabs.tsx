'use client'

import { Box, Tabs, Tab, Typography, Divider, Stack, IconButton, Drawer, Theme, CSSObject, styled } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { ElementDetailsTab, GenePortalTab, GenomicElementType, IcrePortalTab, VariantPortalTab } from "types/globalTypes";
import { genePortalTabs, icrePortalTabs, sharedTabs, variantPortalTabs } from "./tabsConfig";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Image from "next/image";

export type ElementDetailsTabsProps = {
  elementType: GenomicElementType
  elementID: string
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

const ElementDetailsTabs = ({ elementType, elementID, orientation }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1) === elementID ? "" : pathname.substring(pathname.lastIndexOf('/') + 1)

  const [value, setValue] = React.useState(currentTab);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  //If we ever use parallel routes to nest multiple elements in the same view, this will probably break
  useEffect(() => {
    if (currentTab !== value) {
      setValue(currentTab)
    }
  }, [currentTab, value])

  const MiniDrawer = useMemo(() => styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      '& .MuiDrawer-paper': {
        [theme.breakpoints.up('md')]: {
          backgroundColor: '#F2F2F2',
        },
        border: 'none',
        zIndex: theme.zIndex.appBar - 1,
        position: orientation === "vertical" && 'fixed',
        top: orientation === "vertical" && 64,
        left: orientation === "vertical" && 0,
        height: orientation === "vertical" && '100vh',
        width: orientation === "vertical" && drawerWidth
      },
      variants: [
        {
          props: ({ open }) => open,
          style: {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
              ...openedMixin(theme),
              position: orientation === "horizontal" && 'relative',
            },
          },
        },
        {
          props: ({ open }) => !open,
          style: {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
              ...closedMixin(theme),
              position: orientation === "horizontal" && 'relative',
            },
          },
        },
      ],
    }),
  ), [orientation]);

  const tabs: ElementDetailsTab[] = useMemo(() => {
    let elementSpecificTabs: VariantPortalTab[] | GenePortalTab[] | IcrePortalTab[];
    switch (elementType) {
      case ("gene"):
        elementSpecificTabs = genePortalTabs
        break
      case ("variant"):
        elementSpecificTabs = variantPortalTabs
        break
      case ("icre"):
        elementSpecificTabs = icrePortalTabs
        break
    }
    return [
      ...elementSpecificTabs,
      ...sharedTabs,
    ]
  }, [elementType])

  const horizontalTabs = orientation === "horizontal"

  return (
    <MiniDrawer variant="permanent" open={open || horizontalTabs} sx={{ width: horizontalTabs ? "100%" : drawerWidth }}>
      {!horizontalTabs && (
        <Box>
          <Stack direction={"row"} justifyContent={open ? "space-between" : "center"} alignItems={"center"} my={1}>
            {open && (
              <Typography variant="h6" ml={2}>
                Contents
              </Typography>
            )}
            <IconButton color="inherit" aria-label={open ? "close drawer" : "open drawer"} onClick={toggleDrawer}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
          <Divider variant="middle" id="This" />
        </Box>
      )}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Tabs"
        orientation={orientation}
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons={horizontalTabs ? true : false}
        sx={{
          "& .MuiTab-root": {
            alignItems: open ? "flex-start" : "center",
            paddingLeft: open ? 2 : 0,
            "&.Mui-selected": {
              backgroundColor: "rgba(73, 77, 107, .15)",
              borderRadius: 1,
            },
          },
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            opacity: 0.3,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            label={tab.label}
            value={tab.href}
            LinkComponent={Link}
            href={`/${elementType}/${elementID}/${tab.href}`}
            key={tab.href}
            icon={
              !open && <Image width={50} height={50} src={tab.iconPath} alt={tab.label + ' icon'} />
            }
            sx={{ mb: !open ? 2 : 0 }}
          />
        ))}
      </Tabs>
    </MiniDrawer>
  );
}

export default ElementDetailsTabs
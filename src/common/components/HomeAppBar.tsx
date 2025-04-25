"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Menu,
  Container,
  MenuItem,
  Link as MuiLink,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "next/link";
import Image from "next/image";
import AutoComplete from "./autocomplete";
import { Search } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu"
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export type PageInfo = {
  pageName: string,
  link: string,
  dropdownID?: number,
  subPages?: { pageName: string, link: string }[]
}

const pageLinks: PageInfo[] = [
  {
    pageName: "About",
    link: "/about",
    dropdownID: 0,
    subPages: [
      { pageName: "Overview", link: "/about" },
      { pageName: "Contact Us", link: "/about#contact-us" },
    ],
  },
  {
    pageName: "Portals",
    link: "/#portals",
    dropdownID: 1,
    subPages: [
      { pageName: "Gene", link: "/gene" },
      { pageName: "iCRE", link: "/icre" },
      { pageName: "Variant", link: "/variant" },
      { pageName: "Cell Lineage", link: "/lineage" },
      { pageName: "Phenotype", link: "/phenotype" },
    ],
  },
];

type ResponsiveAppBarProps = {
  maintenance?: boolean;
};

function ResponsiveAppBar({ maintenance }: ResponsiveAppBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Hover dropdowns, deals with setting its position
  const [anchorDropdown0, setAnchorDropdown0] = useState<null | HTMLElement>(null)
  const [anchorDropdown1, setAnchorDropdown1] = useState<null | HTMLElement>(null)

  const toggleDrawer = (open: boolean) => {
    console.log("called with: ", open)
    setDrawerOpen(open);
  };

  // Open Dropdown
  const handleOpenDropdown = (event: React.MouseEvent<HTMLElement>, dropdownID: number) => {
    if (dropdownID === 0) {
      setAnchorDropdown0(event.currentTarget)
    } else if (dropdownID === 1) {
      setAnchorDropdown1(event.currentTarget)
    }
  }

  // Close Dropdown
  const handleCloseDropdown = (dropdownID: number) => {
    if (dropdownID === 0) {
      setAnchorDropdown0(null)
    } else if (dropdownID === 1) {
      setAnchorDropdown1(null)
    }
  }

  const handleMouseMoveLink = (event: React.MouseEvent<HTMLElement>, page: PageInfo) => {
    if (page?.subPages && 'dropdownID' in page) {
      handleOpenDropdown(event, page.dropdownID)
    }
  }

  const handleMouseLeaveLink = (event: React.MouseEvent<HTMLElement>, page: PageInfo) => {
    if (page?.subPages && 'dropdownID' in page) {
      switch (page.dropdownID) {
        case 0: {
          if (anchorDropdown0) {
            handleCloseDropdown(0)
          }
          break;
        }
        case 1: {
          if (anchorDropdown1) {
            handleCloseDropdown(1)
          }
          break;
        }
      }
    }
  }

  return (
    <>
      <Stack
        direction={"row"}
        style={{
          position: 'fixed',
          width: '100%',
          height: "40px",
          backgroundColor: '#ff9800',
          zIndex: 1301,
          color: '#fff',
          textAlign: 'center',
          display: !maintenance && "none"
        }}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={2}
      >
        <WarningAmberIcon />
        <Typography sx={{ fontWeight: 'bold' }}>Scheduled maintenance is in progress... Some features may be unavailable</Typography>
        <WarningAmberIcon />
      </Stack>
      <AppBar position="fixed" sx={{ top: maintenance ? '40px' : '0px' }}>
        <Container maxWidth={false}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Display Icon on left when >=900px */}
            <Box
              component={Link}
              href={"/"}
              height={45}
              width={110}
              position={"relative"}
            >
              <Image
                priority
                src="/igSCREEN_red.png"
                fill
                sizes="110px"
                alt="igSCREEN logo"
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </Box>
            {/* Main navigation items for desktop */}
            <Box display={{ xs: "none", md: "flex" }} alignItems={"center"}>
              <Box sx={{ display: { xs: "flex" } }}>
                {pageLinks.map((page) => (
                  <Box
                    key={page.pageName}
                    display={"flex"}
                    alignItems={"center"}
                    onMouseMove={(event) => handleMouseMoveLink(event, page)}
                    onMouseLeave={(event) => handleMouseLeaveLink(event, page)}
                    id="LinkBox"
                    sx={{ mr: 2 }}
                  >
                    <MuiLink
                      id="Link"
                      display={"flex"}
                      fontFamily={(theme) => theme.typography.fontFamily}
                      underline="hover"
                      color="primary.contrastText"
                      component={Link}
                      href={page.link}
                    >
                      {page.pageName}
                      {page.subPages && <ArrowDropDownIcon />}
                    </MuiLink>
                    {/* Create popup menu if page has subpages */}
                    {page.subPages && (
                      <Menu
                        id={`${page.pageName}-dropdown-appbar`}
                        // This logic would need to change when adding another dropdown
                        anchorEl={page.dropdownID === 0 ? anchorDropdown0 : anchorDropdown1}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        open={page.dropdownID === 0 ? Boolean(anchorDropdown0) : Boolean(anchorDropdown1)}
                        onClose={() => handleCloseDropdown(page.dropdownID)}
                        slotProps={{ paper: { onMouseLeave: () => handleCloseDropdown(page.dropdownID), sx: { pointerEvents: 'auto' } } }}
                        sx={{ pointerEvents: 'none', zIndex: 2000 }} //z index of AppBar is 1100 for whatever reason
                      >
                        {page.subPages &&
                          page.subPages.map((subPage) => (
                            <MuiLink
                              key={subPage.pageName}
                              underline="hover"
                              color="black"
                              component={Link}
                              href={subPage.link}
                            >
                              <MenuItem>
                                {subPage.pageName}
                              </MenuItem>
                            </MuiLink>
                          ))}
                      </Menu>
                    )}
                  </Box>
                ))}
              </Box>
              <AutoComplete
                style={{ width: 400 }}
                slots={{
                  button: <IconButton sx={{ color: "white" }}>
                    <Search />
                  </IconButton>,
                }}
                slotProps={{
                  box: { gap: 1 },
                  input: {
                    size: "small",
                    label: "Enter a gene, iCRE, variant or locus",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666666",
                        "&.Mui-focused": {
                          color: "#444444",
                        },
                      },
                      "& .MuiInputLabel-shrink": {
                        display: "none",
                      },
                    },
                  },
                }}
              />
            </Box>
            {/* mobile view */}
            <Box display={{ xs: "flex", md: "none" }} alignItems={"center"} gap={2}>
              <IconButton
                size="large"
                onClick={() => {
                  console.log("icon setting drawer open")
                  toggleDrawer(true)
                }}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <MobileMenu
              pageLinks={pageLinks}
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
            />
          </Toolbar>
        </Container>
      </AppBar>
      {/* Bumps content down since header is position="fixed" */}
      {/* Bumps content down even more if banner is open */}
      {maintenance && <Box sx={{ height: '40px' }} />}
      <Toolbar />
    </>
  );
};
export default ResponsiveAppBar;


// variant: "contained",
// children: <Search />,
// color: "primary",
// sx: {
//   color: "white",
//   borderColor: "white",
//   "&:hover": {
//     color: "gray",
//     borderColor: "gray",
//   },
//   "&:focus": {
//     color: "gray",
//     borderColor: "gray",
//   },
// },
"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Menu,
  Container,
  Button,
  MenuItem,
  Paper,
  Link as MuiLink,
  TextField,
  styled,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import AutoComplete from "./mainsearch/autocomplete";
import { Search } from "@mui/icons-material";

const pageLinks = [
  {
    pageName: "About",
    link: "/about",
  },
  {
    pageName: "Portals",
    link: "/portal",
    dropdownID: "1",
    subPages: [
      { pageName: "Gene", link: "/gene" },
      { pageName: "SNP", link: "/snp" },
      { pageName: "iCREs", link: "/icres" },
      { pageName: "Cell Lineage", link: "/celllineage" },
      { pageName: "Phenotype", link: "/phenotype" },
    ],
  },
];

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    height: "50px ",
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
});

/**
 * @todo: Hamburger Menu, need to align optically without setting the margin to zero - it messes up interacting with the button
 */

const ResponsiveAppBar = () => {
  // Hover dropdowns, deals with setting its position
  const [anchorElNav_Dropdown0, setAnchorElNav_Dropdown0] =
    React.useState<null | HTMLElement>(null);
  const [anchorElNav_Dropdown1, setAnchorElNav_Dropdown1] =
    React.useState<null | HTMLElement>(null);

  // Open Dropdown
  const handleOpenNavMenu_Dropdown = (
    event: React.MouseEvent<HTMLElement>,
    dropdownID: string
  ) => {
    if (dropdownID == "0") {
      setAnchorElNav_Dropdown0(event.currentTarget);
    } else if (dropdownID == "1") {
      setAnchorElNav_Dropdown1(event.currentTarget);
    }
  };

  // Close Dropdown
  const handleCloseNavMenu_Dropdown = (dropdownID: string) => {
    if (dropdownID == "0") {
      setAnchorElNav_Dropdown0(null);
    } else if (dropdownID == "1") {
      setAnchorElNav_Dropdown1(null);
    }
  };

  return (
    <>
      <AppBar position="fixed">
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
                alt="igSCREEN logo"
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </Box>
            {/* Main navigation items for desktop */}
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Box sx={{ display: { xs: "flex" } }}>
                {pageLinks.map((page) => (
                  <Box key={page.pageName}>
                    <Button
                      sx={{
                        color: "white",
                        display: "flex",
                        textTransform: "none",
                        "& .MuiButton-endIcon": { ml: 0 },
                      }}
                      endIcon={page.subPages && <ArrowDropDownIcon />}
                      onMouseEnter={
                        page.subPages
                          ? (event) =>
                              handleOpenNavMenu_Dropdown(event, page.dropdownID)
                          : undefined
                      }
                    >
                      <MuiLink
                        component={Link}
                        href={page.link}
                        variant="body1"
                        sx={{
                          color: (theme) => theme.palette.primary.contrastText,
                        }}
                      >
                        {page.pageName}
                      </MuiLink>
                    </Button>
                    {/* Create popup menu if page has subpages */}
                    {page.subPages && (
                      <Menu
                        id={`${page.pageName}-dropdown-appbar`}
                        // This logic would need to change when adding another dropdown
                        anchorEl={
                          page.dropdownID == "0"
                            ? anchorElNav_Dropdown0
                            : anchorElNav_Dropdown1
                        }
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        open={
                          page.dropdownID == "0"
                            ? Boolean(anchorElNav_Dropdown0)
                            : Boolean(anchorElNav_Dropdown1)
                        }
                        onClose={() =>
                          handleCloseNavMenu_Dropdown(page.dropdownID)
                        }
                        //These are to prevent focus ring from showing up in some browsers, but doesn't work completely
                        MenuListProps={{
                          autoFocusItem: false,
                          autoFocus: false,
                        }}
                        slotProps={{
                          paper: {
                            onMouseLeave: () =>
                              handleCloseNavMenu_Dropdown(page.dropdownID),
                            elevation: 0,
                            sx: { backgroundColor: "transparent" },
                          },
                        }}
                      >
                        {/* This box is here to provide better onMouseLeave behavior, still not ideal */}
                        <Box width="auto" height="25px"></Box>
                        <Paper elevation={4} sx={{ margin: 0.75 }}>
                          {page.subPages &&
                            page.subPages.map((subPage) => (
                              <MenuItem
                                key={subPage.pageName}
                                onClick={() =>
                                  handleCloseNavMenu_Dropdown(page.dropdownID)
                                }
                              >
                                {/* Wrap in next/link to enable dyanic link changing from basePath in next.config.js */}
                                <MuiLink
                                  component={Link}
                                  textAlign={"center"}
                                  href={subPage.link}
                                >
                                  {subPage.pageName}
                                </MuiLink>
                              </MenuItem>
                            ))}
                        </Paper>
                      </Menu>
                    )}
                  </Box>
                ))}
              </Box>
              <AutoComplete
                style={{ width: 400 }}
                // slots={{
                //   input: <StyledTextField label="Search" />,
                // }}
                slotProps={{
                  button: {
                    variant: "contained",
                    children: <Search />,
                    color: "primary",
                    sx: {
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        color: "gray",
                        borderColor: "gray",
                      },
                      "&:focus": {
                        color: "gray",
                        borderColor: "gray",
                      },
                    },
                  },
                  box: { gap: 0 },
                  input: {
                    size: "small",
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
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};
export default ResponsiveAppBar;

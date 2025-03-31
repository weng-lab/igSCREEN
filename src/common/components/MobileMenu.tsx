"use client"
import { Search } from "@mui/icons-material"
import { Box, Button, Divider, Drawer, IconButton, List, ListItem } from "@mui/material"
import MuiLink from "@mui/material/Link"
import AutoComplete from "./autocomplete"
import Link from "next/link";
import { PageInfo } from "./HomeAppBar"

export type MobileMenuProps = {
    pageLinks: PageInfo[]
    drawerOpen: boolean
    toggleDrawer: (open: boolean) => void
}

export default function MobileMenu({pageLinks, drawerOpen, toggleDrawer}: MobileMenuProps) {
    
    const closeDrawer = () => {
        console.log("closeDrawer called in MobileMenu")
        toggleDrawer(false)
    }
    
    return (
        <>
            <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
                <Box sx={{ width: 400, p: 2 }}>
                    <AutoComplete
                        style={{ width: "100%"}}
                        closeDrawer={closeDrawer}
                        slots={{
                            button: (
                                <IconButton sx={{ color: "black" }}>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                        slotProps={{
                            box: { gap: 1 },
                            input: {
                                size: "small",
                                label: "Enter a gene, snp, icre or locus",
                                sx: {
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#ffffff",
                                    },
                                },
                            },
                            button: {
                                onClick: closeDrawer
                            }
                        }}
                    />
                    <br/>
                    <Divider />
                    <List>
                        {pageLinks.slice().reverse().map((page) => (
                            <Box key={page.pageName} sx={{ mb: 1 }}>
                                <ListItem onClick={closeDrawer}>
                                    <MuiLink
                                        component={Link}
                                        href={page.link}
                                        sx={{
                                            color: "black",
                                            textTransform: "none",
                                            justifyContent: "start",
                                            width: "100%"
                                        }}
                                    >
                                        {page.pageName}
                                    </MuiLink>
                                </ListItem>
                                {page.subPages && (
                                    <List sx={{ pl: 2 }}>
                                        {page.subPages.map((subPage) => (
                                            <ListItem key={subPage.pageName} sx={{ py: 0 }} onClick={closeDrawer}>
                                                <MuiLink component={Link} href={subPage.link} sx={{ color: "gray", textTransform: "none" }}>
                                                    {subPage.pageName}
                                                </MuiLink>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                                <Divider />
                            </Box>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

"use client";
import { IconButton } from "@mui/material";
import { DialogContent, Dialog, Typography } from "@mui/material";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { Instructions } from "./_components/instructions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function CellLineageLayout({ children }: { children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Grid container>
      <Grid
        size={{ xs: 12, xl: 12 }}
        height="fit-content"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        position="relative"
        paddingInline={2}
      >
        <Header setDialogOpen={setDialogOpen} />
        {children}
        {/* Dialog for instructions */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogContent>
            <Instructions cellTypeTreeWidth={835} />
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
}

function Header({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  return (
    <Box
      sx={{ p: 1 }}
      pt={2}
      mt={2}
      width={"100%"}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"baseline"}
      borderRadius={1}
    >
      <Typography variant="h4">Cell Lineage Applet</Typography>
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        width={"100%"}
      >
        <Typography variant="subtitle1">
          Compare immune cCRE activity between selected immune cell types.
        </Typography>
        <IconButton onClick={() => setDialogOpen(true)}>
          <InfoOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

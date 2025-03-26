import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function CellLineageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Header />
        {children}
      </Grid>
    </Grid>
  );
}

function Header() {
  return (
    <Box
      sx={{ p: 1 }}
      pt={2}
      mt={2}
      width={"100%"}
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
      </Box>
    </Box>
  );
}

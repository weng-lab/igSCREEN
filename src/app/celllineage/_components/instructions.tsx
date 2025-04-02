import { List, ListItemText } from "@mui/material";

import { ArrowRight } from "@mui/icons-material";

import { ListItemIcon } from "@mui/material";

import { ListItem } from "@mui/material";

import { Typography } from "@mui/material";

import { Box } from "@mui/material";

export function Instructions({
  cellTypeTreeWidth,
}: {
  cellTypeTreeWidth: number;
}) {
  return (
    <Box maxWidth={cellTypeTreeWidth}>
      <Typography variant="h4">How to Use:</Typography>
      <List disablePadding dense sx={{ mb: 2 }}>
        <ListItem disablePadding>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText>Click to select up to 6 cells.</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText>
            For stimulable cells, hold Option/Command (MacOS) or Alt/Windows
            (Windows) and click to stimulate cell.
          </ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText>
            Stimulating a cell does not automatically select it.
          </ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText>
            By default, all cells are unstimulated. Stimulable cells can be
            unstimulated, stimulated, or both (counts as two selections).
          </ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText>
            The more cells types that are selected, the longer it will take to
            generate.
          </ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText>
            Click any bar/count in UpSet plot to download set (.BED)
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
}

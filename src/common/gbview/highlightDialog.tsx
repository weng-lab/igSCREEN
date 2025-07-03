import { Box, DialogContent, Typography } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { Dialog } from "@mui/material";
import { Domain } from "psychscreen-legacy-components";
import { useBrowserStore } from "track-logic";

export type GBHighlight = {
  id: string;
  domain: Domain;
  color: string;
};

export default function HighlightDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const highlights = useBrowserStore((state) => state.highlights);
  return (
    <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Current Highlights</DialogTitle>
        <DialogContent>
          {highlights.map((highlight, index) => (
            <Box
              key={highlight.id}
              display="flex"
              flexDirection="column"
              justifyContent="left"
              width="100%"
              bgcolor={index % 2 === 0 ? "#f5f5f5" : "white"}
              sx={{
                "&:hover": {
                  backgroundColor: "lightgray",
                },
              }}
              p={2}
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="left"
              >
                <Typography variant="body1" color={highlight.color}>
                  {highlight.id}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color={"gray"}>
                  {highlight.domain.chromosome}:
                  {highlight.domain.start.toLocaleString()}-
                  {highlight.domain.end.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
  )
}
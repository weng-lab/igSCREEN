import { Link, Typography, Box, Paper, CircularProgress, Stack } from "@mui/material";
import IntersectingiCREs from "app/region/[region]/icres/IntersectingiCREs";
import { useIcreData } from "common/hooks/useIcreData";
import { GenomicRange } from "types/globalTypes";

export default function SnpiCREs({ coordinates }: { coordinates: GenomicRange }) {
  const { data, loading, error } = useIcreData({
    coordinates: {
      start: coordinates.start,
      end: coordinates.end,
      chromosome: coordinates.chromosome,
    },
  });
  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" color="error" sx={{ fontWeight: 500 }}>
          There was an error fetching iCRE data
        </Typography>
      </Paper>
    );
  }

  if (data?.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          No intersecting iCREs found in this region
        </Typography>
      </Paper>
    );
  }
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Intersecting iCRE</Typography>
      <Box height="auto">
        <IntersectingiCREs
          region={{
            chromosome: coordinates.chromosome,
            start: coordinates.start,
            end: coordinates.end,
          }}
          showRowOnly
        />
      </Box>
    </Stack>
  );
}

import { Typography, Paper, CircularProgress } from "@mui/material";
import IntersectingiCREs from "common/components/IntersectingiCREs";
import { useIcreData } from "common/hooks/useIcreData";
import { GenomicRange } from "types/globalTypes";

export default function VariantIntersectingIcre({ coordinates }: { coordinates: GenomicRange }) {
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
    <IntersectingiCREs
      region={{
        chromosome: coordinates.chromosome,
        start: coordinates.start,
        end: coordinates.end,
      }}
      showRowOnly
    />
  );
}

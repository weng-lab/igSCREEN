import { Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Loading(){
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6, xl: 4 }} >
        <Skeleton variant="rounded" width={"100%"} height={705} />
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }} >
        <Skeleton variant="rounded" width={"100%"} height={705} />
      </Grid>
      <Grid size={{ xs: 12, md: 6, xl: 4 }} >
        <Skeleton variant="rounded" width={"100%"} height={705} />
      </Grid>
    </Grid>
  )
}
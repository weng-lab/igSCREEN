import { OpenInNew } from "@mui/icons-material";
import Grid2 from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function cCREPage({ searchParams }: { searchParams: { accession?: string } }) {
  const accession = searchParams.accession;
  const url = `https://screen.wenglab.org/search/?q=${accession}&uuid=0&assembly=GRCh38`;

  return (
    <main>
      <Grid2 container spacing={4} sx={{ maxWidth: "70%", mr: "auto", ml: "auto", mt: "3rem", mb: "3rem" }}>
        <Grid2 size={12}>
          <Typography variant="h3">No details found for {accession}</Typography>
          <Typography pt={2} variant="body1">
            For more information on this cCRE, please view this cCRE on our other site{" "}
            <Typography component="span" display="inline" color="blue">
              <Link href={url} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                SCREEN<OpenInNew sx={{ fontSize: '1rem', verticalAlign: 'middle' }} />
              </Link>
            </Typography>
            .
          </Typography>
        </Grid2>
      </Grid2>
    </main>
  );
}

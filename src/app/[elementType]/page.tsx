"use client";
import { Box, Button, Divider, Grid2, IconButton, Stack, Typography } from "@mui/material";
import { GenomeSearch, Result } from "@weng-lab/psychscreen-ui-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isValidGenomicElement } from "types/globalTypes";
import { ExpandMore } from "@mui/icons-material";


type PortalConfig = {
  image: string;
  title: string;
  description: string;
};

const geneConfig: PortalConfig = {
  image: "/assets/gene-bcre.png",
  title: "Gene",
  description:
    "Explore gene expression across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
};

const icreConfig: PortalConfig = {
  image: "/assets/disease-trait.png",
  title: "Explore",
  description:
    "Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
};

const snpConfig: PortalConfig = {
  image: "/assets/snp-qtl.png",
  title: "SNP",
  description:
    "Search SNPs of interest and explore their impact on gene expression, chromatin accessibility, transcription factor (TF) binding and other molecular traits in immune cells.",
};

export default function PortalPage({
  params: { elementType },
}: {
  params: { elementType: string };
}) {
  if (!isValidGenomicElement(elementType)) {
    throw new Error("Unknown genomic element type: " + elementType);
  }

  const router = useRouter();

  /**
   * The tab that this ends up directing to is configured in next.config.mjs
   */
  const handleSearchSubmit = (result: Result) => {
    router.push(result.type + "/" + result.title);
  };

  const { image, title, description } =
    elementType === "gene"
      ? geneConfig
      : elementType === "icre"
        ? icreConfig
        : snpConfig;

  const popularSearches = [
    { name: "APOE", id: "ENSG00000130203.10", region: "chr19: 44905791-44909393" },
    { name: "Name", id: "shjdflwdbwl", region: "chr1:15000-20000" },
    { name: "Name", id: "ausdla", region: "chr1:15000-20000" },
    // add more as needed
  ];

  return (
    <Grid2 container marginInline={5} marginTop={5} spacing={2}>
      <Grid2 size={12} display={"flex"} flexDirection={"column"}>
        {/* Panel container */}
        <Grid2
          size={12}
          display={"flex"}
          flexDirection={{
            xs: "column",
            md: "row",
          }}
          justifyContent={"center"}
          spacing={2}
        >
          {/* Left Panel */}
          <Grid2
            size={{
              xs: 12,
              md: 4,
              lg: 3,
            }}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-evenly"}
          >
            <Typography variant="h3">{title} Portal</Typography>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"flex-start"}
            >
              <Typography mb={2}>{description}</Typography>
              <GenomeSearch
                assembly="GRCh38"
                onSearchSubmit={handleSearchSubmit}
                queries={[
                  elementType === "gene"
                    ? "Gene"
                    : elementType === "icre"
                      ? "iCRE"
                      : "SNP",
                ]}
                sx={{ width: "100%" }}
              />
            </Box>
          </Grid2>
          {/* Right Panel */}
          <Grid2
            size={{
              xs: 12,
              md: 6,
            }}
            position="relative"
            sx={{
              height: {
                lg: "350px",
                md: "250px",
                xs: "200px",
              },
            }}
          >
            <Image
              style={{ objectFit: "contain", objectPosition: "center" }}
              src={image}
              fill
              alt={`${title} logo`}
            />
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 size={12} display={"flex"} flexDirection={"column"}>
        <Divider sx={{ display: "flex" }} variant="fullWidth">
          <IconButton
            onClick={() => {
              var element = document.getElementById("searches");
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            sx={{ cursor: 'pointer' }}
          >
            <ExpandMore />
          </IconButton>
        </Divider>
      </Grid2>
      <Grid2 size={6} display={"flex"} justifyContent={"center"}>
        <Typography variant="h3" id="searches">Popular Searches</Typography>
      </Grid2>
      <Grid2 container spacing={2} justifyContent="center" marginTop={2} size={12}>
        {popularSearches.map((element, index) => (
          <Grid2
            key={index}
            size={{
              xs: 12,
              md: 4,
              lg: 3,
            }}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            p={2}
            border={1}
            borderRadius={2}
            borderColor="divider"
          >
            <Stack spacing={1}>
              <Typography variant="h6">{element.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {element.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {element.region}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              sx={{ alignSelf: "flex-end", marginTop: 2 }}
              onClick={() => handleSearchSubmit(element.name)}
            >
              Go
            </Button>
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  );
}

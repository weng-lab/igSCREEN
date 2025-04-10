"use client";
import { Box, Grid2, Typography } from "@mui/material";
import { GenomeSearch, Result } from "@weng-lab/psychscreen-ui-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isValidGenomicElement } from "types/globalTypes";

type PortalConfig = {
  image: string;
  title: string;
  description: string;
};

const geneConfig: PortalConfig = {
  image: "/assets/GenePortal.png",
  title: "Gene",
  description:
    "Explore gene expression across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
};

const icreConfig: PortalConfig = {
  image: "/assets/iCREPortal.png",
  title: "Explore",
  description:
    "Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
};

const snpConfig: PortalConfig = {
  image: "/assets/SNPPortal.png",
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

  return (
    <Grid2 container marginInline={5} marginTop={5}>
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
        {/* Content container */}
        <Grid2
          size={12}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          spacing={2}
        >
          {/* MORE CONTENT HERE */}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

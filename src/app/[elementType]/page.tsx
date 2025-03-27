"use client";
import { Box, Link, Button, Grid2, Typography } from "@mui/material";
import { GenomeSearch, Result } from "@weng-lab/psychscreen-ui-components";
import { formatPortal } from "common/utility";
import { useRouter } from "next/navigation";
import { isValidGenomicElement } from "types/globalTypes";
import Image from "next/image";
import { ArrowForwardIos } from "@mui/icons-material";

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

  return (
    <Grid2 container marginInline={5} marginTop={5}>
      <Grid2 size={12} display={"flex"} flexDirection={"column"}>
        <Typography variant="h3" mb={2}>
          {title} Portal
        </Typography>
        <Grid2
          size={12}
          display={"flex"}
          flexDirection={{
            xs: "column",
            md: "row",
          }}
          justifyContent={"space-evenly"}
        >
          <Grid2
            size={{
              xs: 12,
              md: 4,
            }}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"flex-start"}
          >
            <Typography mb={4}>{description}</Typography>
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
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              md: 6,
            }}
            position="relative"
            sx={{ height: "400px" }}
          >
            <Image
              style={{ objectFit: "contain", objectPosition: "center" }}
              src={image}
              fill
              alt={`${title} logo`}
            />
          </Grid2>
        </Grid2>
        <Grid2
          size={12}
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          {/* MORE CONTENT HERE */}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

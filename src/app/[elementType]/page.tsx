"use client";
import { Box, Button, Divider, Grid2, IconButton, Stack, Typography } from "@mui/material";
import { GenomeSearch, Result, ResultType } from "@weng-lab/psychscreen-ui-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isValidGenomicElement } from "types/globalTypes";
import { ExpandMore } from "@mui/icons-material";
import Link from "next/link";

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
  title: "iCRE",
  description:
    "Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
};

const snpConfig: PortalConfig = {
  image: "/assets/SNPPortal.png",
  title: "SNP",
  description:
    "Search SNPs of interest and explore their impact on gene expression, chromatin accessibility, transcription factor (TF) binding and other molecular traits in immune cells.",
};

export default function PortalPage({ params: { elementType } }: { params: { elementType: string } }) {
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
    elementType === "gene" ? geneConfig : elementType === "icre" ? icreConfig : snpConfig;

  const popularSearches = {
    Gene: [
      { name: "SPIB", region: "chr19:50,418,938-50,431,313" },
      { name: "NCAM1", region: "chr11:112,961,247-113,278,436" },
      { name: "FOXP3", region: "chrX:49,250,436-49,264,826" },
      { name: "BATF", region: "chr14:75,522,425-75,547,015" },
      { name: "APOE", region: "chr19:44,905,754-44,909,393" },
    ],

    iCRE: [
      { name: "EH38E3314260", region: "chr19:50,417,519-50,417,853" },
      { name: "EH38E2984813", region: "chr11:112,886,979-112,887,323" },
      { name: "EH38E3934197", region: "chrX:49,264,498-49,264,848" },
      { name: "EH38E1728788", region: "chr14:75,523,789-75,524,136" },
    ],

    SNP: [
      { name: "rs9466027", region: "chr6:21,298,226-21,298,227" },
      { name: "rs9466028", region: "chr6:21,300,773-21,300,774" },
      { name: "rs80230724", region: "chr6:21,302,562-21,302,563" },
      { name: "rs12528501", region: "chr6:21,316,401-21,316,402" },
    ],
  };

  return (
    <Stack
      spacing={2}
      width={{ xl: "75%", lg: "80%", md: "85%", sm: "90%", xs: "95%" }}
      maxWidth={"1600px"}
      marginX={"auto"}
      marginY={5}
    >
      <Stack direction={{ xs: "column-reverse", md: "row" }} alignItems={"center"} spacing={4}>
        <Stack alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "initial" }}>
          <Typography variant="h4" mb={1}>
            {title} Portal
          </Typography>
          <Typography mb={2}>{description}</Typography>
          <GenomeSearch
            assembly="GRCh38"
            onSearchSubmit={handleSearchSubmit}
            queries={[elementType === "gene" ? "Gene" : elementType === "icre" ? "iCRE" : "SNP"]}
            sx={{ width: "100%" }}
          />
        </Stack>
        <Box
          position={"relative"}
          width={"100%"}
          height={{xs: 250, sm: 300, md: 350, lg: 400, xl: 450}}
          //affects alignment of the image
          sx={{ objectPosition: { md: "right", xs: "center" } }}
        >
          <Image style={{ objectFit: "contain", objectPosition: "inherit" }} src={image} fill alt={title + " image"} />
        </Box>
      </Stack>
      <Divider sx={{ display: "flex" }} variant="fullWidth">
        <IconButton
          onClick={() => {
            var element = document.getElementById("searches");
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          sx={{ cursor: "pointer" }}
        >
          <ExpandMore />
        </IconButton>
      </Divider>
      <Stack spacing={1}>
        <Typography variant="h4" id="searches">
          Not sure where to start?
        </Typography>
        <Typography variant="body1" id="searches">
          We recommend to start with these {title}s
        </Typography>
      </Stack>
      <Grid2 container spacing={5} justifyContent="flex-start" marginTop={2}>
        {popularSearches[title].map((element, index) => (
          <Grid2
            key={index}
            size={{
              xs: 12,
              md: 4,
            }}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="flex-start"
            borderRadius={3}
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, rgba(236, 40, 49, 0) 50%, rgba(236, 40, 49, 0.15) 100%), ${theme.palette.primary.main}`,
              color: "white",
              minHeight: 160,
              p: 3,
              boxShadow: 3,
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {element.region}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {element.name}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              sx={{
                alignSelf: "flex-end",
                backgroundColor: "white",
                color: "#444",
                textTransform: "none",
                boxShadow: 3,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              LinkComponent={Link}
              href={`/${title}/${element.name}`}
            >
              Quick search
            </Button>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
}

//Home Page

"use client";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import Grid2 from "@mui/material/Grid2";
import Image from "next/image";
import { ArrowForwardIos, ExpandMore, Search } from "@mui/icons-material";
import AutoComplete from "../common/components/autocomplete";
import Link from "next/link";
import { portalDescriptions, portalImagePaths } from "common/consts";

export default function Home() {
  type PortalTileProps = {
    imagePosition: "right" | "left";
    imagePath: string;
    title: string;
    description: string;
    link: string;
    buttonText: string;
  };

  const PortalTile = ({ imagePosition, imagePath, title, description, link, buttonText }: PortalTileProps) => (
    <Stack
      direction={{ xs: "column", md: imagePosition === "left" ? "row" : "row-reverse" }}
      alignItems={"center"}
      spacing={2}
    >
      <Box
        position={"relative"}
        width={"100%"}
        height={300}
        //affects alignment of the image
        sx={{ objectPosition: { md: imagePosition === "left" ? "left bottom" : "right bottom", xs: "bottom" } }}
      >
        <Image
          style={{ objectFit: "contain", objectPosition: "inherit" }}
          src={imagePath}
          fill
          alt={title + " image"}
        />
      </Box>
      <Stack alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "initial" }}>
        <Typography variant="h4" mb={1}>
          {title}
        </Typography>
        <Typography mb={2}>{description}</Typography>
        <Button LinkComponent={Link} href={link} variant="contained" endIcon={<ArrowForwardIos />}>
          {buttonText}
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      width={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }}
      maxWidth={"1000px"}
      marginX={"auto"}
      marginY={5}
      spacing={3}
    >
      <Stack spacing={2} textAlign={{xs: 'center', md: 'initial'}} alignItems={{xs: 'center', md: 'initial'}}>
        <Box
          position={"relative"}
          width={"100%"}
          height={150}
          //affects alignment of the image
          sx={{ objectPosition: { xs: "bottom", md: "bottom left" } }}
        >
          <Image
            src="/igSCREEN_red_light.png"
            fill
            alt="igSCREEN logo"
            quality={100}
            style={{ objectFit: "contain", objectPosition: "inherit" }}
          />
        </Box>
        <Typography variant="h6">
          Search <em>immune</em> Candidate cis-Regulatory Elements, Genes, Variants or a Genomic Region
        </Typography>
        <AutoComplete
          style={{ width: 400, maxWidth: '100%' }}
          slots={{
            button: (
              <IconButton color="primary">
                <Search />
              </IconButton>
            ),
          }}
          slotProps={{
            box: { gap: 2 },
            input: {
              label: "Enter a gene, iCRE, variant, or locus",
              sx: {
                backgroundColor: "white",
                "& label.Mui-focused": {
                  color: "primary",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "primary",
                  },
                },
              },
            },
          }}
        />
      </Stack>
      <Divider>
        <Stack
          alignItems={"center"}
          onClick={() => {
            var element = document.getElementById("Portals");
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          sx={{ cursor: "pointer" }}
        >
          <Typography variant="h5" id="Portals">
            Portals
          </Typography>
          <ExpandMore />
        </Stack>
      </Divider>
      <Stack divider={<Divider />} spacing={5}>
        <PortalTile
          imagePosition={"right"}
          imagePath={portalImagePaths.gene}
          title={"Gene Portal"}
          description={portalDescriptions.gene}
          link={"/gene"}
          buttonText={"Explore Genes"}
        />
        <PortalTile
          imagePosition={"left"}
          imagePath={portalImagePaths.icre}
          title={"iCRE Portal"}
          description={portalDescriptions.icre}
          link={"/icre"}
          buttonText={"Explore iCREs"}
        />
        <PortalTile
          imagePosition={"right"}
          imagePath={portalImagePaths.variant}
          title={"Variant Portal"}
          description={portalDescriptions.variant}
          link={"/variant"}
          buttonText={"Explore Variants"}
        />
        <PortalTile
          imagePosition={"left"}
          imagePath={portalImagePaths.phenotype}
          title={"Phenotype Heritability Enrichment"}
          description={portalDescriptions.phenotype}
          link={"/phenotype"}
          buttonText={"Explore Phenotypes"}
        />
        <PortalTile
          imagePosition={"right"}
          imagePath={portalImagePaths.lineage}
          title={"Immune cCRE Activity by Cell Type"}
          description={portalDescriptions.lineage}
          link={"/lineage"}
          buttonText={"Explore cCRE activity"}
        />
      </Stack>
    </Stack>
  );
}

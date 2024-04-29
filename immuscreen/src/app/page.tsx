//Home Page

"use client"
import { Box, FormControl, MenuItem, Stack, Typography } from "@mui/material"
import React, { useState } from "react"

import Select, { SelectChangeEvent } from "@mui/material/Select";
// Grid v2 isn't declared stable yet, but using it now as it's what MUI is currently developing out
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { GeneAutoComplete } from "../common/components/mainsearch/GeneAutocomplete";
import { SnpAutoComplete } from "../common/components/mainsearch/SnpAutocomplete";
import { CcreAutoComplete } from "../common/components/mainsearch/CcreAutocomplete";
import Image from 'next/image'
import MainSearch from "../common/components/mainsearch/MainSearch";
import GenomicRegion from "../common/components/mainsearch/genomicregion";
import { ExpandMore, ArrowRight } from "@mui/icons-material";

const Home = () => {
  const [selectedPortal, setSelectedPortal] = useState<string>("Genes");
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };

  return (
    <Grid2 container pt={3} maxWidth={{ xl: "65%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }} margin={"auto"}>
      <Grid2 xs={12}>
        <Image
          src="/igSCREEN_red_light.png"
          width={400}
          height={150}
          alt="igSCREEN logo"
        />
        <Typography variant="h6" mb={1}>Search <em>immune</em> Candidate cis-Regulatory Elements by ENCODE</Typography>
        <FormControl variant="standard" sx={{ mb: 2 }}>
          {/* todo, replace this with the Main Search component from SCREEN */}
          <Select
            id="portal-select"
            value={selectedPortal}
            onChange={handleChange}
          >
            <MenuItem value={"Genes"}>Genes</MenuItem>
            <MenuItem value={"iCREs"}>iCREs</MenuItem>
            <MenuItem value={"Genomic Region"}>Genomic Region</MenuItem>
            <MenuItem value={"SNPs"}>SNPs</MenuItem>
          </Select>
        </FormControl>
        {
          selectedPortal === "Genes" ? <GeneAutoComplete textColor={"black"} assembly={"GRCh38"} />
            : selectedPortal === "SNPs" ? <SnpAutoComplete textColor={"black"} assembly={"GRCh38"} />
              : selectedPortal === "Genomic Region" ? <GenomicRegion assembly="GRCh38" />
                : <CcreAutoComplete textColor={"black"} assembly={"GRCh38"} />
        }
      </Grid2>
      <Grid2 container flexDirection={"column"} alignItems={"center"} xs={12}>
        <Typography variant="h5">Portals</Typography>
        {/* Todo make scroll */}
        <ExpandMore />
      </Grid2>
      <Grid2 container xs={12} justifyContent={"space-between"}>
        <Grid2 xs={12} md={5} order={{ xs: 2, md: 1 }}>
          <Typography variant="h4">Gene Portal</Typography>
          <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sem nulla, fermentum in neque ut, tincidunt pellentesque eros. Ut vel ex vel tellus facilisis sodales ac ac risus.</Typography>
          <Stack direction="row">
            <ArrowRight />
            <Typography>This is a statistic</Typography>
          </Stack>
          <Stack direction="row">
            <ArrowRight />
            <Typography>This is a statistic</Typography>
          </Stack>
          <Stack direction="row" mb={2}>
            <ArrowRight />
            <Typography>This is a statistic</Typography>
          </Stack>
          <GeneAutoComplete textColor={"black"} assembly={"GRCh38"} />
        </Grid2>
        <Grid2 container xs={12} md={7} order={{ xs: 1, md: 2 }} justifyContent={{ xs: "center", md: "flex-end" }} minHeight={250}>
          <Box position={"relative"} height={"100%"} width={'100%'} sx={{objectPosition: {md: "right bottom", xs: "left bottom"}}}>
            <Image
              objectFit="contain"
              objectPosition="inherit"
              src="/assets/gene-bcre.png"
              fill
              alt="igSCREEN logo"
            />
          </Box>
        </Grid2>
      </Grid2>
    </Grid2>
  )
}

export default Home;
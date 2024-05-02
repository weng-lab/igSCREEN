//Home Page

"use client"
import { Box, Button, Divider, FormControl, MenuItem, Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { GeneAutoComplete } from "../common/components/mainsearch/GeneAutocomplete";
import { SnpAutoComplete } from "../common/components/mainsearch/SnpAutocomplete";
import { CcreAutoComplete } from "../common/components/mainsearch/CcreAutocomplete";
import Image from 'next/image'
import MainSearch from "../common/components/mainsearch/MainSearch";
import GenomicRegion from "../common/components/mainsearch/genomicregion";
import { ExpandMore } from "@mui/icons-material";

const Home = () => {
  const [selectedPortal, setSelectedPortal] = useState<string>("Genes");
  const [elementSearch, setElementSearch] = useState<string>("Genomic Region")

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };

  const handleSetElementSearch = (event: SelectChangeEvent) => {
    setElementSearch(event.target.value);
  };

  return (
    <Grid2 container pt={3} maxWidth={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }} margin={"auto"} rowSpacing={10}>
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
          selectedPortal === "Genes" ? <GeneAutoComplete assembly={"GRCh38"} />
            : selectedPortal === "SNPs" ? <SnpAutoComplete assembly={"GRCh38"} />
              : selectedPortal === "Genomic Region" ? <GenomicRegion assembly="GRCh38" />
                : <CcreAutoComplete textColor={"black"} assembly={"GRCh38"} />
        }
      </Grid2>
      <Grid2 xs={12}>
        <Divider>
          <Stack
            alignItems={"center"}
            onClick={() => {
              var element = document.getElementById("Portals");
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h5" id="Portals">Portals</Typography>
            <ExpandMore />
          </Stack>
        </Divider>
      </Grid2>
      {/* Portals */}
      <Grid2 xs={12}>
        <div>
          <Grid2 container rowSpacing={8}>
            <Grid2 xs={12}>
              {/* Gene Portal */}
              <div>
                <Grid2 container xs={12} justifyContent={"space-between"}>
                  <Grid2 xs={12} md={5} order={{ xs: 2, md: 1 }}>
                    <Typography variant="h4">Gene Portal</Typography>
                    <Typography mb={2}>Explore gene expression across immune cell types at bulk and single-cell resolution for 63 cell types across 305 experiments.</Typography>
                    <GeneAutoComplete assembly={"GRCh38"} />
                  </Grid2>
                  <Grid2 container xs={12} md={7} order={{ xs: 1, md: 2 }} minHeight={250}>
                    <Box position={"relative"} height={"100%"} width={'100%'} sx={{ objectPosition: { md: "right bottom", xs: "left bottom" } }}>
                      <Image
                        style={{ objectFit: "contain", objectPosition: "inherit" }}
                        src="/assets/gene-bcre.png"
                        fill
                        alt="igSCREEN logo"
                      />
                    </Box>
                  </Grid2>
                </Grid2>
              </div>
            </Grid2>
            <Grid2 xs={12}>
              <Divider />
            </Grid2>
            <Grid2 xs={12}>
              {/* Element Portal */}
              <div>
                <Grid2 container xs={12} justifyContent={"space-between"}>
                  <Grid2 container xs={12} md={7} order={{ xs: 1, md: 1 }} minHeight={250}>
                    <Box position={"relative"} height={"100%"} width={'100%'} sx={{ objectPosition: { md: "left bottom", xs: "left bottom" } }}>
                      <Image
                        style={{ objectFit: "contain", objectPosition: "inherit" }}
                        src="/assets/disease-trait.png"
                        fill
                        alt="igSCREEN logo"
                      />
                    </Box>
                  </Grid2>
                  <Grid2 xs={12} md={5} order={{ xs: 1, md: 1 }}>
                    <Typography variant="h4">Element Portal</Typography>
                    <Typography>Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 305 experiments.</Typography>
                    <FormControl variant="standard" sx={{ mb: 2 }}>
                      <Select
                        id="portal_Select"
                        value={elementSearch}
                        onChange={handleSetElementSearch}
                      >
                        <MenuItem value={"Genomic Region"}>Genomic Region</MenuItem>
                        <MenuItem value={"iCREs"}>iCREs</MenuItem>
                      </Select>
                    </FormControl>
                    {elementSearch === "Genomic Region" ?
                      <GenomicRegion assembly="GRCh38" />
                      :
                      <CcreAutoComplete textColor={"black"} assembly={"GRCh38"} />
                    }
                  </Grid2>
                </Grid2>
              </div>
            </Grid2>
            <Grid2 xs={12}>
              <Divider />
            </Grid2>
            <Grid2 xs={12}>
              {/* SNP Portal */}
              <div>
                <Grid2 container xs={12} justifyContent={"space-between"}>
                  <Grid2 xs={12} md={5} order={{ xs: 2, md: 1 }}>
                    <Typography variant="h4">SNP Portal</Typography>
                    <Typography mb={2}>Search SNPs of interest and explore their impact on gene expression, chromatin accessibility, transcription factor (TF) binding and other molecular traits in immune cells.</Typography>
                    <SnpAutoComplete assembly={"GRCh38"} />
                  </Grid2>
                  <Grid2 container xs={12} md={7} order={{ xs: 1, md: 2 }} minHeight={250}>
                    <Box position={"relative"} height={"100%"} width={'100%'} sx={{ objectPosition: { md: "right bottom", xs: "left bottom" } }}>
                      <Image
                        style={{ objectFit: "contain", objectPosition: "inherit" }}
                        src="/assets/snp-qtl.png"
                        fill
                        alt="igSCREEN logo"
                      />
                    </Box>
                  </Grid2>
                </Grid2>
              </div>
            </Grid2>
            <Grid2 xs={12}>
              <Divider />
            </Grid2>
            <Grid2 xs={12}>
              {/* Phenotype Portal */}
              <div>
                <Grid2 container xs={12} justifyContent={"space-between"}>
                  <Grid2 container xs={12} md={7} order={{ xs: 1, md: 1 }} minHeight={250}>
                    <Box position={"relative"} height={"100%"} width={'100%'} sx={{ objectPosition: { md: "left bottom", xs: "left bottom" } }}>
                      <Image
                        style={{ objectFit: "contain", objectPosition: "inherit" }}
                        src="/assets/snp-qtl.png"
                        fill
                        alt="igSCREEN logo"
                      />
                    </Box>
                  </Grid2>
                  <Grid2 xs={12} md={5} order={{ xs: 1, md: 1 }}>
                    <Typography variant="h4">Phenotype Portal</Typography>
                    <Typography mb={2}>Explore heritability enrichment for 280+ traits within gene regulatory features, such as immune cCREs.</Typography>
                    <Button variant="contained" href="/phenotype">
                      Explore Phenotypes
                    </Button>
                  </Grid2>
                </Grid2>
              </div>
            </Grid2>
          </Grid2>
        </div>
      </Grid2>
    </Grid2>
  )
}

export default Home;
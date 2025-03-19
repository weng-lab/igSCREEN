//Home Page

"use client"
import { Box, Button, Divider, IconButton, Stack, Typography, useTheme } from "@mui/material"
import React, { useState } from "react"
import { SelectChangeEvent } from "@mui/material/Select";
import Grid2 from "@mui/material/Grid2"
import Image from 'next/image'
import { ArrowForwardIos, ExpandMore, Login, Search } from "@mui/icons-material";
import AutoComplete from "../common/components/autocomplete";
import Link from "next/link";

const Home = () => {
  const theme = useTheme();

  return (
    (<Grid2 container pt={3} maxWidth={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }} margin={"auto"}>
      <Grid2 size={12}>
        <Image
          src="/igSCREEN_red_light.png"
          width={400}
          height={150}
          alt="igSCREEN logo"
        />
        <Typography variant="h6" mb={1}>Search <em>immune</em> Candidate cis-Regulatory Elements, Genes, SNPs or a Genomic Region</Typography>
        <AutoComplete
          style={{ width: 400 }}
          slots={{
            button: <IconButton color="primary">
            <Search />
          </IconButton>,
          }}
          slotProps={{
            box: { gap: 2 },
            input: {
              label: "Enter a gene, snp, icre or locus",
              sx: {
                backgroundColor: "white",
                "& label.Mui-focused": {
                  color: theme.palette.primary.main,
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            },
          }}
        />
      </Grid2>
      <Grid2 mt={10} mb={5} size={12}>
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
      <Grid2 mb={5} size={12}>
        <div>
          <Grid2 container rowSpacing={10}>
            <Grid2 size={12}>
              {/* Gene Portal */}
              <div>
                <Grid2 container justifyContent={"space-between"} spacing={3} size={12}>
                  <Grid2
                    order={{ xs: 2, md: 1 }}
                    alignSelf={"center"}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Typography variant="h4">Gene Portal</Typography>
                    <Typography mb={2}>Explore gene expression across immune cell types at bulk and single-cell resolution for 63 cell types across 305 experiments.</Typography>
                    <Button LinkComponent={Link} href="/gene" variant="contained" endIcon={<ArrowForwardIos />}>Explore Genes</Button>
                  </Grid2>
                  <Grid2
                    order={{ xs: 1, md: 2 }}
                    minHeight={300}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
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
            <Grid2 size={12}>
              <Divider />
            </Grid2>
            <Grid2 size={12}>
              {/* Element Portal */}
              <div>
                <Grid2 container justifyContent={"space-between"} spacing={3} size={12}>
                  <Grid2
                    order={{ xs: 1, md: 1 }}
                    minHeight={300}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Box position={"relative"} height={"100%"} width={'100%'} sx={{ objectPosition: { md: "left bottom", xs: "left bottom" } }}>
                      <Image
                        style={{ objectFit: "contain", objectPosition: "inherit" }}
                        src="/assets/disease-trait.png"
                        fill
                        alt="igSCREEN logo"
                      />
                    </Box>
                  </Grid2>
                  <Grid2
                    order={{ xs: 1, md: 1 }}
                    alignSelf={"center"}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Typography variant="h4">Element Portal</Typography>
                    <Typography mb={2}>Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 305 experiments.</Typography>
                    <Button LinkComponent={Link} href="/icre" variant="contained" endIcon={<ArrowForwardIos />}>Explore iCREs</Button>
                  </Grid2>
                </Grid2>
              </div>
            </Grid2>
            <Grid2 size={12}>
              <Divider />
            </Grid2>
            <Grid2 size={12}>
              {/* SNP Portal */}
              <div>
                <Grid2 container justifyContent={"space-between"} spacing={3} size={12}>
                  <Grid2
                    order={{ xs: 2, md: 1 }}
                    alignSelf={"center"}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Typography variant="h4">SNP Portal</Typography>
                    <Typography mb={2}>Search SNPs of interest and explore their impact on gene expression, chromatin accessibility, transcription factor (TF) binding and other molecular traits in immune cells.</Typography>
                    <Button LinkComponent={Link} href="/snp" variant="contained" endIcon={<ArrowForwardIos />}>Explore SNPs</Button>
                  </Grid2>
                  <Grid2
                    order={{ xs: 1, md: 2 }}
                    minHeight={300}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
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
            <Grid2 size={12}>
              <Divider />
            </Grid2>
            <Grid2 size={12}>
              {/* LDSC Portal */}
              <div>
                <Grid2 container justifyContent={"space-between"} spacing={3} size={12}>
                  <Grid2
                    order={{ xs: 1, md: 1 }}
                    minHeight={300}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Box position={"relative"} height={"100%"} width={'100%'} sx={{ objectPosition: { md: "left bottom", xs: "left bottom" } }}>
                      <Image
                        style={{ objectFit: "contain", objectPosition: "inherit" }}
                        src="/assets/phenotype.png"
                        fill
                        alt="igSCREEN logo"
                      />
                    </Box>
                  </Grid2>
                  <Grid2
                    order={{ xs: 1, md: 1 }}
                    alignSelf={"center"}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Typography variant="h4">Phenotype Portal</Typography>
                    <Typography mb={2}>Explore heritability enrichment for 280+ traits within gene regulatory features, such as immune cCREs.</Typography>
                    <Button LinkComponent={Link} variant="contained" href="/phenotype" endIcon={<ArrowForwardIos />}>
                      Explore Phenotypes
                    </Button>
                  </Grid2>
                </Grid2>
              </div>
            </Grid2>
            <Grid2 size={12}>
              <Divider />
            </Grid2>
            <Grid2 size={12}>
              {/* Cell Activity Portal */}
              <div>
                <Grid2 container justifyContent={"space-between"} spacing={3} size={12}>
                  <Grid2
                    order={{ xs: 2, md: 1 }}
                    alignSelf={"center"}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Typography variant="h4">Immune cCRE Activity by Cell Type</Typography>
                    <Typography mb={2}>Compare immune cCRE activity between immune cell types.</Typography>
                    <Button LinkComponent={Link} variant="contained" href="/celllineage" endIcon={<ArrowForwardIos />}>
                      Explore cCRE activity
                    </Button>
                  </Grid2>
                  <Grid2
                    order={{ xs: 1, md: 2 }}
                    minHeight={300}
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Box position={"relative"} height={"100%"} width={'100%'} sx={{ objectPosition: { md: "right bottom", xs: "left bottom" } }}>
                      <Image
                        style={{ objectFit: "contain", objectPosition: "inherit" }}
                        src="/assets/upset.png"
                        fill
                        alt="igSCREEN logo"
                      />
                    </Box>
                  </Grid2>
                </Grid2>
              </div>
            </Grid2>
          </Grid2>
        </div>
      </Grid2>
    </Grid2>)
  );
}

export default Home;
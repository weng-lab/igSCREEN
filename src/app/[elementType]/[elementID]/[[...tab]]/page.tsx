"use client";
import { CircularProgress, Stack, styled, Typography } from "@mui/material";
import GenomeBrowserView from "common/gbview/genomebrowserview";
import { useElementMetadata, useElementMetadataReturn } from "common/hooks/useElementMetadata";
import { GenomicElementType, isValidGeneTab, isValidIcreTab, isValidVariantTab, isValidTab } from "types/globalTypes";
import SnpEQTLs from "./_SnpTabs/_eQTLs/SnpEQTLs";
import GeneEQTLs from "./_GeneTabs/_eQTLs/GeneEQTLs";
import GeneExpression from "./_GeneTabs/_GeneExpression/GeneExpression";
import IcreActivity from "./_IcreTabs/_IcreActivity/IcreActivity";
import LinkedGenes from "./_IcreTabs/_linkedGenes/linkedGenes";
import LinkedICREs from "./_GeneTabs/_linkedICREs/linkedICREs";
import SnpGWASLdr from "./_SnpTabs/_SnpGWASLdr/SnpGWASLdr";
import IcreVariantsTab from "./_IcreTabs/_variants/IcreVariantsTab";
import SnpFrequencies from "./_SnpTabs/SnpFrequencies";
import NearbycCREs from "./_GeneTabs/_nearbycCREs/nearbycCREs";
import { useState } from "react";
import Switch from '@mui/material/Switch';
import IntersectingiCREs from "app/region/[region]/icres/IntersectingiCREs";
import SnpiCREs from "./_SnpTabs/SnpiCREs";

//Styled switch componet from mui docs with our logos and colors
const CcreSwitch = styled(Switch)(({ theme }) => ({
  width: 75,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(35px)',
      '& .MuiSwitch-thumb:before': {
        backgroundPosition: 'center',
        backgroundSize: '50%',
        backgroundImage: `url("/SCREEN_icon.png")`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundImage: `url("/Logo.png")`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#a75a5f',
    borderRadius: 20 / 2,
  },
}));

export default function DetailsPage({
  params: { elementType, elementID, tab },
}: {
  /**
   * Should be able to safely type this as GenomicElementType instead of string
   * since the layout wrapping this ensures the type is fulfilled
   */
  params: { elementType: GenomicElementType; elementID: string; tab: string };
}) {
  const [allcCREs, setAllcCREs] = useState<boolean>(false)

  const toggleOnlyICREs = () => {
    setAllcCREs(!allcCREs)
  }
  
  if (tab === undefined) {
    tab = "";
  } else {
    tab = tab[0];
  }
  /**
   * Configure valid tabs in globalTypes.ts
   */
  if (!isValidTab(tab)) {
    console.log(tab);
    console.log(isValidTab(tab));
    console.log(isValidIcreTab(tab));
    throw new Error("Unknown tab: " + tab);
  }

  const { data: elementMetadata, loading, error } = useElementMetadata({ elementType, elementID });

  if (loading) {
    return <CircularProgress />;
  }

  if (!elementMetadata?.coordinates) {
    return <Typography>Issue fetching data on {elementID}</Typography>;
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  //Handle shared tabs
  if (tab === "browser") {
    return (
      <GenomeBrowserView
        coordinates={elementMetadata.coordinates}
        name={
          elementMetadata.__typename === "Gene"
            ? elementMetadata.name
            : elementMetadata.__typename === "ICRE"
            ? elementMetadata.accession
            : elementMetadata.id
        }
        type={elementType}
      />
    );
  }

  switch (elementType) {
    case "variant": {
      if (!isValidVariantTab(tab)) {
        throw new Error("Unknown variant details tab: " + tab);
      }

      const variantData = elementMetadata as useElementMetadataReturn<"variant">["data"];

      switch (tab) {
        case "":
          return <> <SnpFrequencies snpid={variantData.id}/> <SnpGWASLdr snpid={variantData.id}/> </>;
        case "icres":
          return <SnpiCREs coordinates={variantData.coordinates} />;
        case "genes":
          return <SnpEQTLs rsid={variantData.id} />;
      }
    }

    case "gene": {
      if (!isValidGeneTab(tab)) {
        throw new Error("Unknown gene details tab: " + tab);
      }

      const geneData = elementMetadata as useElementMetadataReturn<"gene">["data"];

      switch (tab) {
        case (""): return <GeneExpression name={geneData.name} id={geneData.id} />
        case ("icres"):  return (
          <Stack spacing={2} alignItems={"center"}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography>iCREs Only</Typography>
              <CcreSwitch
                checked={allcCREs}
                onChange={toggleOnlyICREs}
              />
              <Typography>All cCREs</Typography>
            </Stack>
            <NearbycCREs geneid={geneData.id} coordinates={geneData.coordinates} allcCREs={allcCREs} />
            <LinkedICREs geneid={geneData.id} allcCREs={allcCREs} />
          </Stack>
        )
        case ("variants"): return <GeneEQTLs name={geneData.name} id={geneData.id} />
      }
    }

    case "icre": {
      if (!isValidIcreTab(tab)) {
        throw new Error("Unknown iCRE details tab: " + tab);
      }

      const icreData = elementMetadata as useElementMetadataReturn<"icre">["data"];

      switch (tab) {
        case "":
          return <IcreActivity accession={icreData.accession} />;
        case "genes":
          return <LinkedGenes accession={icreData.accession} coordinates={icreData.coordinates} />;
        case "variants":
          return <IcreVariantsTab icreData={icreData} />
      }
    }
  }
}

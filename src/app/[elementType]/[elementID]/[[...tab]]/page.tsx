"use client";
import { CircularProgress, Typography } from "@mui/material";
import GenomeBrowserView from "common/gbview/genomebrowserview";
import { useElementMetadata, useElementMetadataReturn } from "common/hooks/useElementMetadata";
import { GenomicElementType, isValidGeneTab, isValidIcreTab, isValidVariantTab, isValidTab } from "types/globalTypes";
import GeneExpression from "./_GeneTabs/_Gene/GeneExpression";
import IcreActivity from "./_IcreTabs/_iCREs/IcreActivity";
import IcreLinkedGenes from "./_IcreTabs/_Genes/IcreLinkedGenes";
import IcreVariantsTab from "./_IcreTabs/_Variants/IcreVariantsTab";
import VariantIntersectingIcre from "./_SnpTabs/_iCREs/VariantIntersectingIcre";
import EQTLs from "common/components/EQTLTables";
import GeneLinkedIcres from "./_GeneTabs/_iCREs/GeneLinkedIcres";
import VariantInfo from "./_SnpTabs/_Variant/Variant";

export default function DetailsPage({
  params: { elementType, elementID, tab },
}: {
  /**
   * Should be able to safely type this as GenomicElementType instead of string
   * since the layout wrapping this ensures the type is fulfilled
   */
  params: { elementType: GenomicElementType; elementID: string; tab: string };
}) {
  /**
   * Since [[...tab]] is an optional catch-all route, tabs is an array.
   * tab is undefined when hitting /elementType/elementID (default tab's route).
   * "" is defined as valid shared route in the type SharedRoute, so change undefined to ""
   */
  if (tab === undefined) {
    tab = "";
  } else {
    tab = tab[0];
  }
  /**
   * Configure valid tabs in globalTypes.ts
   */
  if (!isValidTab(tab)) {
    throw new Error("Unknown tab: " + tab);
  }

  const { data, loading, error } = useElementMetadata({ elementType, elementID });

  if (loading) {
    return <CircularProgress />;
  }

  if (!data?.coordinates) {
    return <Typography>Issue fetching data on {elementID}</Typography>;
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  //Handle shared tabs
  if (tab === "browser") {
    return (
      <GenomeBrowserView
        coordinates={data.coordinates}
        name={data.__typename === "Gene" ? data.name : data.__typename === "ICRE" ? data.accession : data.id}
        type={elementType}
      />
    );
  }

  switch (elementType) {
    case "variant": {
      if (!isValidVariantTab(tab)) {
        throw new Error("Unknown variant details tab: " + tab);
      }

      const variantData = data as useElementMetadataReturn<"variant">["data"];

      switch (tab) {
        case "":
          return <VariantInfo snpid={variantData.id} />;
        case "icres":
          return <VariantIntersectingIcre coordinates={variantData.coordinates} />;
        case "genes":
          return <EQTLs data={variantData} elementType="variant" />;
      }
    }

    case "gene": {
      if (!isValidGeneTab(tab)) {
        throw new Error("Unknown gene details tab: " + tab);
      }

      const geneData = { data: data as useElementMetadataReturn<"gene">["data"], loading, error };

      switch (tab) {
        case "":
          return <GeneExpression geneData={geneData} />;
        case "icres":
          return <GeneLinkedIcres geneData={geneData} />;
        case "variants":
          return <EQTLs data={geneData.data} elementType="gene" />;
      }
    }

    case "icre": {
      if (!isValidIcreTab(tab)) {
        throw new Error("Unknown iCRE details tab: " + tab);
      }

      const icreData = data as useElementMetadataReturn<"icre">["data"];

      switch (tab) {
        case "":
          return <IcreActivity accession={icreData.accession} />;
        case "genes":
          return <IcreLinkedGenes accession={icreData.accession} coordinates={icreData.coordinates} />;
        case "variants":
          return <IcreVariantsTab icreData={icreData} />;
      }
    }
  }
}

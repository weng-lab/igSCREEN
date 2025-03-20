'use client'
import { CircularProgress, Typography } from "@mui/material"
import NearbyGenomicFeatures from "app/[elementType]/[elementID]/[tab]/_SharedTabs/NearbyGenomicFeatures"
import { GenomeBrowserView } from "common/gbview/genomebrowserview"
import { GenomicRange } from "common/gbview/types"
import { useElementMetadata, useElementMetadataReturn } from "common/hooks/useElementMetadata"
import { GenomicElementType, isValidGeneTab, isValidIcreTab, isValidSnpTab, isValidTab } from "types/globalTypes"
import SnpEQTLs from "./_SnpTabs/SnpEQTLs"
import GeneEQTLs from "./_GeneTabs/GeneEQTLs"
import GeneExpression from "./_GeneTabs/_GeneExpression/GeneExpression"
import IcreActivity from "./_IcreTabs/IcreActivity"

export default function DetailsPage({
  params: { elementType, elementID, tab },
}: {
  /**
   * Should be able to safely type this as GenomicElementType instead of string
   * since the layout wrapping this ensures the type is fulfilled
   */
  params: { elementType: GenomicElementType, elementID: string, tab: string } 
}){
  if (!isValidTab(tab)){
    throw new Error("Unknown tab: " + tab)
  }

  const {data: elementMetadata, loading, error} = useElementMetadata({elementType, elementID})

  if (loading) {
    return <CircularProgress />
  }

  if (!elementMetadata?.coordinates){
    return <Typography>Issue fetching data on {elementID}</Typography>
  }

  if (error){
    throw new Error(JSON.stringify(error))
  }

  //Handle shared tabs
  if (tab === "nearby") {
    return <NearbyGenomicFeatures coordinates={elementMetadata.coordinates} elementID={elementID} elementType={elementType} />
  }
  if (tab === "browser") {
    /**
     * @todo not properly passing in element details for highlight yet
     */
    const highlight = {
      domain: {
        chromosome: elementMetadata.coordinates.chromosome,
        start: elementMetadata.coordinates.start,
        end: elementMetadata.coordinates.end,
      },
      color: "red",
      id: "test",
    }
    console.log("highlight", highlight);
    return <GenomeBrowserView assembly="GRCh38" highlights={[highlight]} coordinates={elementMetadata.coordinates} gene={elementMetadata.__typename === "Gene" ? elementMetadata.name : undefined} />
  }

  switch (elementType) {
    case ("snp"): {
      if (!isValidSnpTab(tab)) {
        throw new Error("Unknown SNP details tab: " + tab)
      }

      const snpData = elementMetadata as useElementMetadataReturn<"snp">["data"]

      switch (tab) {
        case ("eQTLs"): return <SnpEQTLs rsid={snpData.id} />
      }
    }

    case ("gene"): {
      if (!isValidGeneTab(tab)) {
        throw new Error("Unknown SNP details tab: " + tab)
      }

      const geneData = elementMetadata as useElementMetadataReturn<"gene">["data"]

      switch (tab) {
        case ("eQTLs"): return <GeneEQTLs name={geneData.name} id={geneData.id} />
        case ("linked"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
        case ("expression"): return <GeneExpression name={geneData.name} id={geneData.id} />
      }
    }

    case ("icre"): {
      if (!isValidIcreTab(tab)) {
        throw new Error("Unknown SNP details tab: " + tab)
      }
      
      const icreData = elementMetadata as useElementMetadataReturn<"icre">["data"]

      switch (tab) {
        case ("linked"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
        case ("activity"): return <IcreActivity accession={icreData.accession}/>
      }
    }
  }

  
}
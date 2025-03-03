
import { useElementMetadata } from "common/hooks/useElementMetadata"
import { GenomicElementType, isValidGeneTab, isValidIcreTab, isValidSnpTab, isValidTab } from "types/globalTypes"

/**
 * @todo
 * - Create switch block for rendering correct details page
 * - add check for valid elementID (Where is the best place to do this once. In the layout component? Here? I feel like both checks should happen in the same place)
 */

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

  const elementMetadata = useElementMetadata({elementType, elementID})

  // Handle shared tabs
  if (tab === "nearby") {
    return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
  }

  if (tab === "browser") {
    return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
  }

  switch (elementType) {
    case ("snp"): {
      if (!isValidSnpTab(tab)) {
        throw new Error("Unknown SNP details tab: " + tab)
      }
      switch (tab) {
        case ("eQTLs"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
      }
    }
    case ("gene"): {
      if (!isValidGeneTab(tab)) {
        throw new Error("Unknown SNP details tab: " + tab)
      }
      switch (tab) {
        case ("eQTLs"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
        case ("linked"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
        case ("expression"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
      }
    }
    case ("icre"): {
      if (!isValidIcreTab(tab)) {
        throw new Error("Unknown SNP details tab: " + tab)
      }
      switch (tab) {
        case ("linked"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
        case ("activity"): return <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
      }
    }
  }

  
}
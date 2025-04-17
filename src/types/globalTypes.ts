/**
 * These are where the universal shared types should be kept
 */

export interface GenomicRange {
  chromosome: string;
  start: number;
  end: number;
}

export type PortalName = "SNP" | "Gene" | "iCRE"

export type GenomicElementType = "snp" | "gene" | "icre"

export function isValidGenomicElement(value: string): value is GenomicElementType {
  return value === "snp" || value === "gene" || value === "icre";
}

//What should the routing be?

/**
 * /icre/EH3812345678/icres
 * /icre/EH3812345678/gene
 * /icre/EH3812345678/variants
 * 
 * /snp/rs12345/variants
 * /snp/rs12345/icre
 * /snp/rs12345/gene
 * 
 * /gene/APOE/gene
 * /gene/APOE/icre
 * /gene/APOE/variants
 * 
 */

/**
 * /icre/EH3812345678
 * /icre/EH3812345678/genes
 * /icre/EH3812345678/variants
 * 
 * /snp/rs12345
 * /snp/rs12345/icres
 * /snp/rs12345/genes
 * 
 * /gene/APOE
 * /gene/APOE/icres
 * /gene/APOE/variants
 * 
 */


export type SharedRoute = "browser" 

//empty route is for the elements default tab. For example /gene/SP1 will be the gene expression. Otherwise would need to assign /gene/SP1/gene
export type SnpRoute = SharedRoute | "" | "icres" | "genes"

export type GeneRoute = SharedRoute | "" | "icres" | "variants"

export type IcreRoute = SharedRoute | "" | "genes" | "variants"

export function isValidSharedTab(tab: string): tab is SharedRoute {
  return tab === "browser"
}

export function isValidSnpTab(tab: string): tab is SnpRoute {
  return isValidSharedTab(tab) || tab === "icres" || tab === "genes"
}

export function isValidGeneTab(tab: string): tab is GeneRoute {
  return isValidSharedTab(tab) || tab === "icres" || tab === "variants"
}

export function isValidIcreTab(tab: string): tab is IcreRoute {
  return isValidSharedTab(tab) || tab === "genes" || tab === "variants"
}

export function isValidTab(tab: string): tab is SharedRoute | SnpRoute | GeneRoute | IcreRoute {
  return isValidSharedTab(tab) || isValidSnpTab(tab) || isValidGeneTab(tab) || isValidIcreTab(tab)
}

/**
 * label is for the display name of the tab.
 * href should match the final dynamic route for the tab.
 */
export type ElementDetailsTab = {
  label: string,
  href: SnpRoute | GeneRoute | IcreRoute
  iconPath: string
}

export interface SharedTab extends ElementDetailsTab {
  href: SharedRoute
}

export interface SnpPortalTab extends ElementDetailsTab {
  href: SnpRoute
}

export interface GenePortalTab extends ElementDetailsTab {
  href: GeneRoute
}

export interface IcrePortalTab extends ElementDetailsTab {
  href: IcreRoute
}
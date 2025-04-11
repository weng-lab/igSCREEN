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

export type SharedRoute = "nearby" | "browser"

export type SnpRoute = SharedRoute | "eQTLs" | "gwasldr"

export type GeneRoute = SharedRoute | "eQTLs" | "linked" | "expression"

export type IcreRoute = SharedRoute | "linked" | "activity" | "gwasldr"

export function isValidSharedTab(tab: string): tab is SharedRoute {
  return tab === "nearby" || tab === "browser"
}

export function isValidSnpTab(tab: string): tab is SnpRoute {
  return isValidSharedTab(tab) || tab === "eQTLs" || tab === "gwasldr"
}

export function isValidGeneTab(tab: string): tab is GeneRoute {
  return isValidSharedTab(tab) || tab === "eQTLs" || tab === "linked" || tab === "expression"
}

export function isValidIcreTab(tab: string): tab is IcreRoute {
  return isValidSharedTab(tab) || tab === "linked" || tab === "activity" || tab === "gwasldr"
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
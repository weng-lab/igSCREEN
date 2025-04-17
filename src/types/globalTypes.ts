/**
 * These are where the universal shared types should be kept
 */

export interface GenomicRange {
  chromosome: string;
  start: number;
  end: number;
}

export type GenomicElementType = "variant" | "gene" | "icre"

export function isValidGenomicElement(value: string): value is GenomicElementType {
  return value === "variant" || value === "gene" || value === "icre";
}

export type SharedRoute = "browser" | ""

//empty route is for the elements default tab. For example /gene/SP1 will be the gene expression. Otherwise would need to assign /gene/SP1/gene
export type VariantRoute = SharedRoute | "icres" | "genes"

export type GeneRoute = SharedRoute | "icres" | "variants"

export type IcreRoute = SharedRoute | "genes" | "variants"

export function isValidSharedTab(tab: string): tab is SharedRoute {
  return tab === "browser" || tab === ""
}

export function isValidVariantTab(tab: string): tab is VariantRoute {
  return isValidSharedTab(tab) || tab === "icres" || tab === "genes"
}

export function isValidGeneTab(tab: string): tab is GeneRoute {
  return isValidSharedTab(tab) || tab === "icres" || tab === "variants"
}

export function isValidIcreTab(tab: string): tab is IcreRoute {
  return isValidSharedTab(tab) || tab === "genes" || tab === "variants"
}

export function isValidTab(tab: string): tab is SharedRoute | VariantRoute | GeneRoute | IcreRoute {
  return isValidSharedTab(tab) || isValidVariantTab(tab) || isValidGeneTab(tab) || isValidIcreTab(tab)
}

/**
 * label is for the display name of the tab.
 * href should match the final dynamic route for the tab.
 */
export type ElementDetailsTab = {
  label: string,
  href: VariantRoute | GeneRoute | IcreRoute
  iconPath: string
}

export interface SharedTab extends ElementDetailsTab {
  href: SharedRoute
}

export interface VariantPortalTab extends ElementDetailsTab {
  href: VariantRoute
}

export interface GenePortalTab extends ElementDetailsTab {
  href: GeneRoute
}

export interface IcrePortalTab extends ElementDetailsTab {
  href: IcreRoute
}
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

export function isGenomicElementType(value: string): value is GenomicElementType {
  return value === "snp" || value === "gene" || value === "icre";
}

/**
 * label is for the display name of the tab.
 * href should match the final dynamic route for the tab.
 * Ex: ```snp/rs12345/nearby``` would be
 * ```jsx
 *  {
 *    label: 'Nearby Genomic Features',
 *    href: 'nearby'
 *  },
 * ```
 */
export type ElementDetailsTab = {
  /**
   * The name to display on the tab
   */
  label: string,
  /**
   * href should match the final dynamic route for the tab.
   * Ex: ```snp/rs12345/nearby``` would be
   * ```jsx
   *  {
   *    label: 'Nearby Genomic Features',
   *    href: 'nearby'
   *  },
   * ```
   */
  href: string
}

export interface SharedTab extends ElementDetailsTab {
  href: "nearby" | "browser"
}

export interface SnpPortalTab extends ElementDetailsTab {
  href: "eQTLs"
}

export interface GenePortalTab extends ElementDetailsTab {
  href: "eQTLs" | "linked" | "expression"
}

export interface IcrePortalTab extends ElementDetailsTab {
  href: "linked" | "activity"
}
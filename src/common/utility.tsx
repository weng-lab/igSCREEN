import { GenomicRange, PortalName } from "types/globalTypes"
import { cellCategoryColors, cellCategoryDisplaynames } from "./consts"
import { OverridableStringUnion } from '@mui/types';
import { Variant } from "@mui/material/styles/createTypography";
import { Launch } from "@mui/icons-material";
import { Link, TypographyPropsVariantOverrides } from "@mui/material";

/**
 * @todo Merge with utility.ts
 */

export function getClassDisplayname(input: string) {
  switch (input) {
    case ("PLS"): return "Promoter"
    case ("pELS"): return "Proximal Enhancer"
    case ("dELS"): return "Distal Enhancer"
    case ("CA-H3K4me3"): return "Chromatin Accessible with H3K4me3"
    case ("CA-TF"): return "Chromatin Accessible with TF"
    case ("CA-CTCF"): return "Chromatin Accessible with CTCF"
    case ("CA"): return "Chromatin Accessible"
    case ("TF"): return "Transcription Factor"
    case ("InActive"): return "Inactive"
    default: return "No Class Found"
  }
}

/**
 * 
 * @param input chr:start-end
 * @returns Very dumb parser for genomic range. No input checking. Assumes proper formatting and no commas in values
 */
export function parseGenomicRangeString(input: string): GenomicRange {
  if (input.includes("%3A")) {
    return {
      // %3A is URL encoding of ":"
      chromosome: input.split("%3A")[0],
      start: +input.split("%3A")[1].split("-")[0],
      end: +input.split("%3A")[1].split("-")[1],
    }
  } else return {
    chromosome: input.split(":")[0],
    start: +input.split(":")[1].split("-")[0],
    end: +input.split(":")[1].split("-")[1],
  }
}

/**
 * 
 * @param subpath 
 * @returns A formatted portal name for the passed string. If no matching portal returns null
 */
export function formatPortal(subpath: string): PortalName | null {
  switch (subpath) {
    case ("snp"): return "SNP"
    case ("gene"): return "Gene"
    case ("icre"): return "iCRE"
    default: return null
  }
}

/**
 * 
 * @param cell use ```lineage``` field of return data
 * @returns the corresponding color for that cell category, or black if not found
 */
export function getCellCategoryColor(cell: string): string {
  return cellCategoryColors[cell] || "#000"
}

/**
 * 
 * @param cell use ```lineage``` field of return data
 * @returns the corresponding celltype display name for the category, or "Unknown Celltype if not found"
 */
export function getCellCategoryDisplayname(cell: string) {
  return cellCategoryDisplaynames[cell] || "Unknown Celltype"
}

/**
 * 
 * @param props 
 * @returns 
 */
export const CreateLink: React.FC<{ 
  linkPrefix: string,
   linkArg?: string, 
   label: string, 
   showExternalIcon?: boolean,
    variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>, textColor?: string, underline?: "none" | "always" | "hover" }> = (props) => {
  const link = props.linkPrefix + (props.linkArg ?? "")
  return (
    <Link variant={props.variant} href={link} rel="noopener noreferrer" target="_blank" color={props.textColor} underline={props.underline}>
      {props.label}
      {props.showExternalIcon && <Launch sx={{ display: "inline-flex", verticalAlign: "middle", ml: 0.5 }} color="inherit" fontSize="inherit" />}
    </Link>
  )
}
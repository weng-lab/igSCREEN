import { GenomicRange, PortalName } from "types/globalTypes"
import { cellCategoryColors, cellCategoryDisplaynames, studyLinks } from "./consts"
import { Launch } from "@mui/icons-material";
import { Link as MuiLink, LinkProps as MuiLinkProps, Typography, TypographyOwnProps, TypographyPropsVariantOverrides } from "@mui/material";
import NextLink from 'next/link'
import { LinkProps as NextLinkProps } from "next/link";
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
  return cellCategoryColors[cell] || "#000000"
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
 * @param study use ```study``` field of return data
 * @returns The corresponding DOI link for the study, or "Unknown Study" if not found
 */
export function getStudyLink(study: string) {
  return studyLinks[study] || "Unknown Study"
}

//Combines the props of Next Link and Mui Link, adds the custom props
export type LinkComponentProps = Omit<MuiLinkProps, "component" | "href"> &
  Omit<NextLinkProps, "passHref"> & {
    showExternalIcon?: boolean;
    openInNewTab?: boolean;
  };

/**
 * Mui Link styled component, Next Link behavior
 * @param props ```MuiLinkProps & { showExternalIcon?: boolean }```
 * @returns 
 */
export const LinkComponent = ({
  showExternalIcon,
  openInNewTab = false,
  children,
  ...rest
}: LinkComponentProps) => {
  return (
    <MuiLink
      component={NextLink}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      target={openInNewTab ? "_blank" : undefined}
      {...rest}
    >
      {children}
      {showExternalIcon && (
        <Launch sx={{ display: "inline-flex", verticalAlign: "middle", ml: 0.5 }} color="inherit" fontSize="inherit" />
      )}
    </MuiLink>
  );
};

/**
 * Only use this function if use case is unable to handle jsx element and needs string. Use `toScientificNotationElement` if possible
 */
export function toScientificNotation(num: number, sigFigs?: number) {
  // Convert the number to scientific notation using toExponential
  let scientific = num.toExponential(sigFigs ?? undefined);
  
  // Split the scientific notation into the coefficient and exponent parts
  let [coefficient, exponent] = scientific.split('e');
  
  // Format the exponent part
  let expSign = exponent[0];
  exponent = exponent.slice(1);
  
  // Convert the exponent to a superscript string
  let superscriptExponent = exponent
    .split('')
    .map(char => '⁰¹²³⁴⁵⁶⁷⁸⁹'[char] || char)
    .join('');
  
  // Add the sign back to the exponent
  superscriptExponent = (expSign === '-' ? '⁻' : '') + superscriptExponent;
  
  // Combine the coefficient with the superscript exponent
  return coefficient + '×10' + superscriptExponent;
}

/**
 * @param num Number to convert to Sci Notation
 * @param variant MUI Typography Variant to be used
 * @param sigFigs Number of desired significant figures
 * @returns
 */
export function toScientificNotationElement(
  num: number,
  sigFigs: number,
  typographyProps?: TypographyOwnProps
) {
  if (num > 0.01) {
    return <Typography {...typographyProps}>{num.toFixed(2)}</Typography>;
  }

  // Convert the number to scientific notation using toExponential
  let scientific = num.toExponential(sigFigs);
  let [coefficient, exponent] = scientific.split("e");

  return (
    <Typography {...typographyProps}>
      {coefficient}&nbsp;×&nbsp;10<sup>{exponent}</sup>
    </Typography>
  );
}

const svgData = (_svg): string => {
  let svg = _svg.cloneNode(true);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  let preface = '<?xml version="1.0" standalone="no"?>';
  return preface + svg.outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
};

const downloadData = (text: string, filename: string, type: string = 'text/plain') => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadSVG = (ref: React.MutableRefObject<SVGSVGElement>, filename: string) => {
  ref.current && downloadData(svgData(ref.current!), filename, 'image/svg;charset=utf-8');
}
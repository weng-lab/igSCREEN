import { GenePortalTab, IcrePortalTab, SharedTab, VariantPortalTab } from "types/globalTypes";

const GbIconPath = '/assets/GenomeBrowserIcon.svg'
const IcreIconPath = '/assets/IcreIcon.svg'
const GeneIconPath = '/assets/GeneIcon.svg'
const VariantIconPath = '/assets/VariantIcon.svg'

export const sharedTabs: SharedTab[] = [
  {
    label: "Genome Browser",
    href: "browser",
    iconPath: GbIconPath
  },
];

export const variantPortalTabs: VariantPortalTab[] = [
  {
    label: "Variant",
    href: "",
    iconPath: VariantIconPath
  },
  {
    label: "iCREs",
    href: "icres",
    iconPath: IcreIconPath
  },
  {
    label: "Genes",
    href: "genes",
    iconPath: GeneIconPath
  },
];

export const genePortalTabs: GenePortalTab[] = [
  {
    label: "Gene",
    href: "",
    iconPath: GeneIconPath
  },
  {
    label: "iCREs",
    href: "icres",
    iconPath: IcreIconPath
  },
  {
    label: "Variants",
    href: "variants",
    iconPath: VariantIconPath
  },
];

export const icrePortalTabs: IcrePortalTab[] = [
  {
    label: "iCRE",
    href: "",
    iconPath: IcreIconPath
  },
  {
    label: "Genes",
    href: "genes",
    iconPath: GeneIconPath
  },
  {
    label: "Variants",
    href: "variants",
    iconPath: VariantIconPath
  },
];

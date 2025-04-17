import { GenePortalTab, IcrePortalTab, SharedTab, SnpPortalTab } from "types/globalTypes"

export const sharedTabs: SharedTab[] = [
  {
    label: 'Nearby Genomic Features',
    href: 'nearby'
  },
  {
    label: 'Genome Browser',
    href: 'browser'
  },
]

export const snpPortalTabs: SnpPortalTab[] = [
  {
    label: "eQTLs",
    href: "eQTLs"
  },  
  {
    label: "GWAS SNPs",
    href: "gwassnps"
  }
]

export const genePortalTabs: GenePortalTab[] = [
  {
    label: "eQTLs",
    href: "eQTLs"
  },
  {
    label: "Linked iCREs",
    href: "linked"
  },
  {
    label: "Gene Expression",
    href: "expression"
  }
]

export const icrePortalTabs: IcrePortalTab[] = [
  {
    label: "Linked Genes",
    href: "linked"
  },
  {
    label: "Activity",
    href: "activity"
  },  
  {
    label: "GWAS SNPs",
    href: "gwassnps"
  }
]
import { gql, useQuery } from "@apollo/client";

export default function useLinkedICREs(geneid: string) {
  const { data, loading, error } = useQuery(LINKED_ICRE_QUERY, {
    variables: { geneid: [geneid.split(".")[0]], assembly: "grch38" },
  });

  return { data: data?.linkedcCREs as LinkedICREInfo[], loading, error };
}

export type LinkedICREInfo = {
  accession?: string
  p_val?: number
  gene?: string
  geneid?: string
  genetype?: string
  method?: string
  grnaid?: string
  effectsize?: number
  assay?: "RNAPII-ChIAPET" | "CTCF-ChIAPET" | "Intact-HiC" | "CRISPRi-FlowFISH"
  celltype?: string
  experiment_accession?: string
  tissue?: string
  variantid?: string
  source?: string
  slope?: number
  score?: number
  displayname?: string
  id?: string
}

const LINKED_ICRE_QUERY = gql(`
query LinkedcCREs($geneid: [String!]!, $assembly: String!) {
  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {
    accession
    p_val
    gene
    geneid
    genetype
    method
    grnaid
    effectsize
    assay
    celltype
    experiment_accession
    tissue
    variantid
    source
    slope
    score
    displayname
    __typename
  }
}
  `);

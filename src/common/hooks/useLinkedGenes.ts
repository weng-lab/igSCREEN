import { gql, useQuery } from "@apollo/client"

function useLinkedGenes(accession: string) {
  const { loading, error, data } = useQuery(LINKED_GENES, {
    variables: {
      accessions: [accession],
      assembly: "grch38"
    }
  })    
  
  return {data: data?.linkedGenes as LinkedGeneInfo[], loading, error}
}

export default useLinkedGenes

export type LinkedGeneInfo = {
  p_val: number
  gene: string
  geneid: string
  genetype: string
  method: "CRISPR" | "Chromatin" | "eQTLs"
  accession: string
  grnaid: string
  effectsize: number
  assay: "RNAPII-ChIAPET" | "CTCF-ChIAPET" | "Intact-HiC" | "CRISPRi-FlowFISH"
  celltype: string
  experiment_accession: string
  score: number
  variantid: string
  source: string
  slope: number
  tissue: string
  displayname: string
}


const LINKED_GENES = gql(`
  query nearbyAndLinkedGenes(
    $accessions: [String!]!
    $assembly: String!
  ) {
    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {
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
    }
  }
`)
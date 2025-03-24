import { gql } from "@apollo/client";

export const LINKED_GENES = gql(`
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
import { gql } from "@apollo/client"

export const CLOSEST_GENE_QUERY = gql(`
query getclosestGenetocCRE($geneid: [String],$ccre: [String]) {
  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {
     gene {
      chromosome
      stop
      start
      name
      type
    }
    ccre
    chromosome
    stop
    start
  }
}`);

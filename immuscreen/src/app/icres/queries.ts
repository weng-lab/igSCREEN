import { gql } from "@apollo/client"


export const ATAC_UMAP_QUERY = gql`
query atacUmapQuery($accession: String!) 
{
    calderonAtacUmapQuery(accession: $accession){
      name
      donor
      stimulation
      end
      celltype
      class
      umap_1
      umap_2
      value
      
    }
  }

`
export const ICRES_CT_ZSCORES_QUERY= gql`
query calderoncorceszscoreAtacQuery1($accession: [String], $study: [String]) {
  calderoncorcesAtacQuery(accession: $accession,study: $study) {
    class
    celltype
    subclass
    study
    grouping
    description
    ct_description
    order
    stimulation    
    value
    pmid    
    name
    group
  }
}
`

export const ICRES_BYCT_ZSCORES_QUERY= gql`
query calderoncorcebyctszscoreAtacQuery($accession: [String], $study: [String]) {
  calderoncorcesByCtAtacQuery(accession: $accession,study: $study) {
    class
    celltype
    subclass
    study
    description
    order
    stimulation    
    value    
    name
    group
  }
}
`

export const ICRES_QUERY = gql`
query iCREQuery($coordinates: [GenomicRangeInput!],$accession: [String!]) 
  {
    iCREQuery(coordinates: $coordinates, accession: $accession) {
      rdhs
      accession
      group
      celltypes
      coordinates {
        start
        end
        chromosome
      }
      }
  }
`

export const EBI_ASSO_QUERY =  gql`
query ebiAssoc($accession: String, $snpid: String) 
  {
    ebiAssociationsQuery(accession: $accession, snpid: $snpid) {
      ccre
      class
      strongest_snp_risk_allele
      snpid
      risk_allele_frequency
      region
      chromosome
      immu_screen_trait
      mapped_trait
      position
      link
      p_value
      study
      pubmedid
      }
  }

`
export const ICRES_ACTIVE_EXPERIMENTS = gql`
  query calderoncorceszscoreAtacQuery($accession: [String]) {
    calderoncorcesAtacQuery(accession: $accession) {
      grouping
      description
      name
      start
      value
    }
  }
`
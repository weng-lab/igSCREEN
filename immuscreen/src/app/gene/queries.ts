
import { gql } from "@apollo/client"

export const RNA_UMAP_QUERY = gql`
query rnaUmapQuery($gene_id: String!) 
{
    calderonRnaUmapQuery(gene_id: $gene_id){
      name
      donor
      stimulation      
      celltype
      class
      umap_1
      umap_2
      value
    }
  }

`
export const EQTL_QUERY = gql`
  query GeneeQTLQuery($study: String!, $geneid: String) 
    {
        icreeQTLQuery(study:$study, geneid:$geneid) {
          variant_id
          pvalue
          qvalue
          geneid
          pval_nominal
          phenotype_id
          celltype
          study
          rsid
          pval_beta
        
        }
    }
  
`

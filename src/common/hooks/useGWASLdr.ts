import { gql, useQuery } from "@apollo/client"

function useGWASLdr(icres?: string[], snps?: string[] ) {
  const { loading, error, data } = useQuery(GWAS_LDR_QUERY, {
    variables: {
        icres: icres,
        snps: snps
    }
  })
  
  return {data: data?.immuneGWASLdrQuery as ImmuneGWASLdr[], loading, error}
}

export default useGWASLdr

export type ImmuneGWASLdr = {
    snp_chr: string;
    snp_start: number;
    snp_end: number;
    snpid: string;
    effect_allele: string;
    ref_allele: string;
    zscore: number;
    icre_chr?: string;
    icre_start?: number;
    icre_end?: number;
    icre?: string;
    icre_class?: string;
    study: string;

    author?: string;
    category: string;    
    study_source: string;
    disease: string;
}


const GWAS_LDR_QUERY = gql(`
query getimmuneGWASLdrQuery($icres: [String], $snps: [String]) {
    immuneGWASLdrQuery(snps: $snps, icres: $icres) {
      snp_chr
      snp_end
      snp_start
      snpid
      icre
      ref_allele
      effect_allele
      zscore
      study_source
      disease
      icre_chr
      icre_start
      icre_end
      icre_class
      study
    }
  }`)
  
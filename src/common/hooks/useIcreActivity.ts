import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { IcresZscoresQuery } from "types/generated/graphql";

const GET_ICRE_ACTIVITY = gql(`
  query IcresZscores($accession: String!) {
    immuneiCREsUmapQuery(accession: $accession) {
      source
      value
      umap_atac_1
      assay
      umap_atac_2
      umap_dnase_1
      umap_dnase_2
      umap_1
      link
      umap_2
      celltype
      lineage
      biosample
      biosampleid
      expid
      name
      study
      start
      class
      chromosome
      end
      stimulation
    }
  }
`)

export type IcreActivityAssay = 'ATAC' | 'DNase'

export type UseIcreActivityParams = {
  accession: string,
  assays: IcreActivityAssay[]
}

export type UseIcreActivityReturn = {
  data: IcresZscoresQuery["immuneiCREsUmapQuery"] | undefined;
  loading: boolean;
  error: ApolloError
}

export const useIcreActivity = ({ accession, assays }: UseIcreActivityParams): UseIcreActivityReturn => {

  const { data, loading, error } = useQuery(
    GET_ICRE_ACTIVITY,
    {
      variables: {
        accession
      },
    }
  );

  return {
    data: data?.immuneiCREsUmapQuery.filter(x => assays.includes(x.assay as IcreActivityAssay)),
    loading,
    error,
  }
}
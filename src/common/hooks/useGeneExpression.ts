import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { GeneExpressionQuery, GeneQuery } from "types/generated/graphql";
import { GenomicElementType, GenomicRange } from "types/globalTypes";

const GET_GENE_EXPRESSION = gql(`
  query GeneExpression($gene_id: String!) {
    immuneRnaUmapQuery(gene_id: $gene_id) {
      umap_1
      umap_2
      celltype
      source
      description
      expid
      name
      tree_celltype
      value
      stimulation
    }
  }
`)

export type UseGeneDataParams = {
  id: string
}

export type UseGeneExpressionReturn = {
  data: GeneExpressionQuery["immuneRnaUmapQuery"] | undefined;
  loading: boolean;
  error: ApolloError
}

export const useGeneExpression = ({ id }: UseGeneDataParams): UseGeneExpressionReturn => {

  const { data, loading, error } = useQuery(
    GET_GENE_EXPRESSION,
    {
      variables: {
        gene_id: id.split('.')[0]
      },
    }
  );

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: data?.immuneRnaUmapQuery,
    loading,
    error,
  }
}
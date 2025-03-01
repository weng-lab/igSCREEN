import { useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";

const SNP_Query = gql(`
  query SNP($snpids: [String]) {
    snpQuery(assembly: "GRCh38", snpids: $snpids) {
      id
      coordinates {
        chromosome
        start
        end
      }
    }
  }
`)

export const useSnpData = (rsID:string) => {

  const { data, loading, error } = useQuery(
    SNP_Query,
    {
      variables: {
        snpids: rsID
      }
    }
  );

  return {
    data: data?.snpQuery[0],
    loading,
    error,
  };
};
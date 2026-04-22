import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";


export default function useCcreDetails(accessions: string[]) {
  const { data, loading, error } = useQuery<{ cCREQuery: CCREInfo[] }>(CCRE_QUERY, {
    variables: { accessions },
    skip: !accessions || (accessions.length === 0)
  });

  return { data: data?.cCREQuery as CCREInfo[], loading, error };
}

export type CCREInfo = {
  accession?: string;
  group?: string;
  coordinates?: {
    end?: number;
    start?: number;
    chromosome?: string;
  }
};

const CCRE_QUERY = gql(`
query getcCREDetails($accessions: [String!]) {
  cCREQuery(assembly: "grch38", accession: $accessions) {
    group
    accession
    coordinates {
      start
      chromosome
      end
    }
  }
}
  `);

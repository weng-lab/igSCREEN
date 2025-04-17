import { ApolloError, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { gql } from "types/generated/gql";
import { Gene, GeneQuery } from "types/generated/graphql";
import { GenomicElementType, GenomicRange } from "types/globalTypes";

const GENE_Query = gql(`
  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {
    gene(chromosome: $chromosome, start: $start, end: $end, assembly: "GRCh38", version: 29, name: $name) {
      name
      id
      strand
      coordinates {
        chromosome
        end
        start
      }
    }
  }
`)

type GeneData = GeneQuery["gene"][number] & { description: string }

/**
 * Currently the backend does not support querying for genes in multiple regions,
 * which limits the input here to GenomicRange and not also GenomicRange[]
 */

export type UseGeneDataParams =
  | { name: string | string[]; coordinates?: never; elementType?: GenomicElementType }
  | { coordinates: GenomicRange; name?: never; elementType?: GenomicElementType }

export type UseGeneDataReturn<T extends UseGeneDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { name: string[] })
  ? { data: GeneData[] | undefined; loading: boolean; error: ApolloError }
  : { data: GeneData | undefined; loading: boolean; error: ApolloError };

export const useGeneData = <T extends UseGeneDataParams>({ name, coordinates, elementType }: T): UseGeneDataReturn<T> => {
  const [geneData, setGeneData] = useState<GeneData[] | GeneData | undefined>(undefined);

  const fetchGeneDescription = async (geneName: string) => {
    try {
      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/ncbi_genes/v3/search?authenticity_token=&terms=${geneName.toUpperCase()}`
      );
      const data = await response.json();
      const matches = data[3]?.filter((x: any) => x[3] === geneName.toUpperCase());
      return matches && matches.length >= 1 ? matches[0][4] : "(no description available)";
    } catch {
      return "(no description available)";
    }
  };

  const { data, loading, error } = useQuery(GENE_Query, {
    variables: {
      chromosome: coordinates?.chromosome,
      start: coordinates?.start,
      end: coordinates?.end,
      name,
    },
    skip: elementType !== undefined && elementType !== "gene",
  });

  useEffect(() => {
    const mergeWithDescriptions = async () => {
      if (!data?.gene) return;

      const genes = data.gene;

      if (Array.isArray(name) || coordinates) {
        const describedGenes = await Promise.all(
          genes.map(async (gene) => ({
            ...gene,
            description: await fetchGeneDescription(gene.name),
          }))
        );
        setGeneData(describedGenes as unknown as GeneData);
      } else {
        const gene = genes[0];
        if (gene) {
          const description = await fetchGeneDescription(gene.name);
          setGeneData({ ...gene, description } as unknown as GeneData);

        }
      }
    };

    mergeWithDescriptions();
  }, [data, name, coordinates]);

  return {
    data: geneData,
    loading,
    error,
  } as UseGeneDataReturn<T>;
}
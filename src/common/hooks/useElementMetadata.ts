import { GenomicElementType } from "types/globalTypes";
import { useGeneData, UseGeneDataReturn } from "./useGeneData";
import { useIcreData, UseIcreDataReturn } from "./useIcreData";
import { useSnpData, UseSnpDataReturn } from "./useSnpData";

type useElementMetadataParams<T extends GenomicElementType> = {
  elementType: T,
  elementID: string
}

export type useElementMetadataReturn<T extends GenomicElementType> =
  T extends "gene" ? UseGeneDataReturn<{ name: string }>
  : T extends "icre" ? UseIcreDataReturn<{ accession: string }>
  : UseSnpDataReturn<{ rsID: string }>

export const useElementMetadata = <T extends GenomicElementType>({ elementType, elementID }: useElementMetadataParams<T>): useElementMetadataReturn<T> => {
  /**
   * elementType is being passed to these hooks to prevent data from being fetched unless
   * it actually should be fetched. Need to call all hooks to follow rules of hooks:
   * See https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level
   */
  const geneMetadata = useGeneData({name: elementID, elementType});
  const icreMetadata = useIcreData({accession: elementID, elementType});
  const snpMetadata = useSnpData({rsID: elementID, elementType});

  switch (elementType) {
    case "gene":
      return geneMetadata as useElementMetadataReturn<T>;
    case "icre":
      return icreMetadata as useElementMetadataReturn<T>;
    case "variant":
      return snpMetadata as useElementMetadataReturn<T>;
  }
}
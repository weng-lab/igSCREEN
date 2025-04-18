import { useEffect, useState } from 'react';
import { GenomicElementType } from 'types/globalTypes';

export interface UseGeneDescriptionResult {
  description: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeneDescription(name: string, elementType: GenomicElementType = "gene"): UseGeneDescriptionResult {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    if ((elementType !== undefined) && elementType !== 'gene') return;
    if (!name) return;

    const fetchDescription = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://clinicaltables.nlm.nih.gov/api/ncbi_genes/v3/search?authenticity_token=&terms=${name.toUpperCase()}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        const matches =
          data[3]?.filter((x: string[]) => x[3] === name.toUpperCase());

        setDescription(matches?.length ? matches[0][4] : null);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setDescription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [name]);

  return { description, loading, error };
}

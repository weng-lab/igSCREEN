import { useEffect, useState } from 'react';
import { GenomicElementType } from 'types/globalTypes';
interface Frequency {
    population: string;
    frequency: number;
  }
  
  interface SnpFrequencies {
    ref: string;
    alt: string;
    frequencies: Frequency[];
  }
  
  interface UseSnpFrequenciesResult {
    data: SnpFrequencies | null;
    loading: boolean;
    error: string | null;
  }
  

export function useSnpFrequencies(rsid: string, elementType: GenomicElementType = "variant"): UseSnpFrequenciesResult {
  const [data, setData] = useState<SnpFrequencies | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ((elementType !== undefined) && elementType !== 'variant') return;
    if (!rsid) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://rest.ensembl.org/variation/homo_sapiens/${rsid}?content-type=application/json;pops=1`
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        const allele = data["mappings"][0]["allele_string"].split("/");
        const ref = allele[0];
        const alt = allele[allele.length - 1];

        const pop = [
          "1000GENOMES:phase_3:AMR",
          "1000GENOMES:phase_3:EUR",
          "1000GENOMES:phase_3:AFR",
          "1000GENOMES:phase_3:SAS",
          "1000GENOMES:phase_3:EAS",
        ];

        const frequencies = data["populations"]
          .filter((p: any) => pop.includes(p["population"]) && p["allele"] === ref)
          .map((f: any) => ({
            population: f.population.replace("1000GENOMES:phase_3:", ""),
            frequency: f.frequency,
          }));

        setData({ ref, alt, frequencies });
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rsid]);

  return { data, loading, error };
}

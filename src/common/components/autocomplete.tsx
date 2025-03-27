"use client";
import {
  GenomeSearch,
  GenomeSearchProps,
  Result,
} from "@weng-lab/psychscreen-ui-components";
import { useRouter } from "next/navigation";

/**
 * Redirects the user to the a new page based on the search result
 * @param props - The props for the GenomeSearch component
 */
export default function AutoComplete(props: Partial<GenomeSearchProps>) {
  const router = useRouter();

  const handleSearchSubmit = (r: Result) => {
    props.onSearchSubmit?.(r);

    let url = "";
    switch (r.type) {
      case "Gene":
        url = `/gene/${r.title}`;
        break;
      case "iCRE":
        url = `/icre/${r.title}`;
        break;
      case "Coordinate":
        url = `/region/${r.domain.chromosome}:${r.domain.start}-${r.domain.end}`;
        break;
      case "SNP":
        url = `/snp/${r.title}`;
        break;
    }
    router.push(url);
  };

  return (
    <GenomeSearch
    {...props}
      assembly="GRCh38"
      queries={["Gene", "iCRE", "SNP", "Coordinate"]}
      onSearchSubmit={handleSearchSubmit}
    />
  );
}

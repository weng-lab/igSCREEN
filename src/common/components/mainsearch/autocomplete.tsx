'use client'
import { GenomeSearch, GenomeSearchProps, Result } from "@weng-lab/psychscreen-ui-components";
import { useRouter } from "next/navigation";

export default function AutoComplete(props: Partial<GenomeSearchProps>) {
    const router = useRouter()

    const handleSearchSubmit = (r: Result) => {
        let url = ""
        switch (r.type) {
            case "gene":
                url = `/gene/${r.title}`
                break;
            case "icre":
                url = `/icre/${r.title}`
                break;
            case "coordinate":
                url = `/region/${r.domain.chromosome}:${r.domain.start}-${r.domain.end}`
                break;
            case "snp":
                url = `/snp/${r.title}`
                break;
        }
        router.push(url)
    }

    return (
        <GenomeSearch
            {...props}
            assembly="GRCh38"
            onSearchSubmit={handleSearchSubmit}
            queries={["gene", "icre", "snp", "coordinate"]}
            
        />
    )
}
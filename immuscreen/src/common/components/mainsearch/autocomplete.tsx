import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GenomeSearch, GenomeSearchProps, Result } from "@weng-lab/psychscreen-ui-components";
import { ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://factorbook.api.wenglab.org/graphql",
    cache: new InMemoryCache(),
});

export default function AutoComplete(props: Partial<GenomeSearchProps>) {
    return (
        <ApolloProvider client={client}>
            <GenomeSearch
                {...props}
                assembly="GRCh38"
                onSearchSubmit={handleSearchSubmit}
                queries={["gene", "icre", "snp", "coordinate"]}
            />
        </ApolloProvider>
    )
}

const handleSearchSubmit = (r: Result) => {
    let url = ""
    switch (r.type) {
        case "gene":
            let id = r.description.split("\n")[0]
            url = `/gene?gene=${r.title}&geneid=${id}&chromosome=${r.domain.chromosome}&start=${r.domain.start}&end=${r.domain.end}`
            break;
        case "icre":
            url = `/icres?accession=${r.title}`
            break;
        case "coordinate":
            url = `/icres?chromosome=${r.domain.chromosome}&start=${r.domain.start}&end=${r.domain.end}`
            break;
        case "snp":
            url = `/snp?rsid=${r.title}`
            break;
    }
    window.open(url, "_self")
}
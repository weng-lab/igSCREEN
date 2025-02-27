import { query } from "common/apollo/client"
import NearbyGenomicFeatures from "common/components/NearbyGenomicFeatures"
import { gql } from "types/generated/gql"

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

export default async function SnpNearby({
  params
}: {
  params: { rsID: string }
}) {

  const { data } = await query({
    query: SNP_Query,
    variables: {
      snpids: params.rsID
    }
  });

  return (
    <NearbyGenomicFeatures coordinates={data.snpQuery[0].coordinates} />
  );
}
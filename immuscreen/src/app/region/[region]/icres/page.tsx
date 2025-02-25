import { gql } from "types/generated/gql";
import { query } from "common/apollo/client";
import { parseGenomicRangeString } from "common/utility";
import IntersectingiCREs from "./IntersectingiCREs";

/**
 * @todo look into https://github.com/apollographql/apollo-client-nextjs#preloading-data-in-rsc-for-usage-in-client-components
 */

const ICRES_QUERY = gql(`
  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {
    iCREQuery(coordinates: $coordinates) {
      accession
      group
      celltypes
      coordinates {
        start
        end
        chromosome
      }
    }
  }
`)

export default async function iCREs({ params }: { params: { region: string } }){
  const { data, error } = await query({
    query: ICRES_QUERY,
    variables: {
      coordinates: parseGenomicRangeString(params.region)
    }
  })

  return (
    error ?
      <p>Error fetching intersecting iCREs</p>
      :
      <IntersectingiCREs data={data} />
  )
}
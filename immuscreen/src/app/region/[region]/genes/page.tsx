import { parseGenomicRangeString } from "common/utility";
import IntersectingSNPs from "./IntersectingGenes";


export default function Genes({
  params
}: {
  params: { region: string }
}) {

  const region = parseGenomicRangeString(params.region)

  return (
    <IntersectingSNPs region={region} />
  )
}
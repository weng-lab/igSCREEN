import { parseGenomicRangeString } from "common/utility";
import IntersectingGenes from "../../../../common/components/IntersectingGenes";


export default function Genes({
  params
}: {
  params: { region: string }
}) {

  const region = parseGenomicRangeString(params.region)

  return (
    <IntersectingGenes region={region} />
  )
}
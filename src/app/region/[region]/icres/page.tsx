import { parseGenomicRangeString } from "common/utility";
import IntersectingiCREs from "./IntersectingiCREs";


export default function iCREs({
  params
}: {
  params: { region: string }
}) {

  const region = parseGenomicRangeString(params.region)

  return (
    <IntersectingiCREs region={region} />
  )
}
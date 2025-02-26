import { parseGenomicRangeString } from "common/utility";
import IntersectingSNPs from "./IntersectingSNPs";


export default function SNPs({
  params
}: {
  params: { region: string }
}) {

  const region = parseGenomicRangeString(params.region)

  return (
    <IntersectingSNPs region={region} />
  )
}
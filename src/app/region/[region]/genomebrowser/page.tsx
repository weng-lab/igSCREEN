import { parseGenomicRangeString } from "common/utility";
import { GenomeBrowserView } from "common/gbview/genomebrowserview";


export default function Genes({
  params
}: {
  params: { region: string }
}) {

  const region = parseGenomicRangeString(params.region)

  const highlight = {
    domain: {
      chromosome: region.chromosome,
      start: region.start,
      end: region.end,
    },
    color: "red",
    id: "test",
  }
  
  return (
    <GenomeBrowserView assembly="GRCh38" highlights={[highlight]} coordinates={region} />
  )
}
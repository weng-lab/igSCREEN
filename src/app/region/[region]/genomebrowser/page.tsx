import { parseGenomicRangeString } from "common/utility";
import GenomeBrowserView from "common/gbview/genomebrowserview";

export default function Genes({ params }: { params: { region: string } }) {
  const region = parseGenomicRangeString(params.region);
  return <GenomeBrowserView coordinates={region} name={null} type={null} />;
}

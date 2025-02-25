import RegionSearchTabs from './RegionSearchTabs';
import { parseGenomicRangeString } from 'common/utility';

export default function RegionSearchLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { region: string }
}) {
  
  const region = parseGenomicRangeString(params.region)

  return (
    <>
      <RegionSearchTabs region={region} />
      <main>{children}</main>
    </>
  )
}
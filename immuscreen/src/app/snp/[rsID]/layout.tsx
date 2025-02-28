import ElementDetailsLayout from "common/ElementDetails/ElementDetailsLayout"


export default function RegionSearchLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { rsID: string }
}) {
  return (
    <ElementDetailsLayout
      tabs={[
        {
          label: 'eQTLs',
          href: 'eQTLs'
        },
        {
          label: 'Nearby Genomic Features',
          href: 'nearby'
        },
      ]}
      elementName={params.rsID}
      elementType='SNP'
    >
      {children}
    </ElementDetailsLayout>
  )
}
import ElementDetailsLayout from "common/ElementDetails/ElementDetailsLayout"

export default function SnpDetailsLayout({
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
          label: 'Nearby Genomic Features',
          href: 'nearby'
        },
        {
          label: 'eQTLs',
          href: 'eQTLs'
        }
      ]}
      elementName={params.rsID}
      elementType='SNP'
    >
      {children}
    </ElementDetailsLayout>
  )
}
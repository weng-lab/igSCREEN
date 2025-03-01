import ElementDetailsLayout from "common/ElementDetails/ElementDetailsLayout"

export default function IcreDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { accession: string }
}) {
  return (
    <ElementDetailsLayout
      tabs={[
        {
          label: 'Nearby Genomic Features',
          href: 'nearby'
        }
      ]}
      elementName={params.accession}
      elementType='iCRE'
    >
      {children}
    </ElementDetailsLayout>
  )
}
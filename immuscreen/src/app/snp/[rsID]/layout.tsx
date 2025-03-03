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
      elementID={params.rsID}
      elementType='snp'
    >
      {children}
    </ElementDetailsLayout>
  )
}
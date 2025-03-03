import ElementDetailsLayout from "common/ElementDetails/ElementDetailsLayout"
import { GenePortalTab, GenomicElementType, IcrePortalTab, isGenomicElementType, SharedTab, SnpPortalTab } from "types/globalTypes"

export default function IcreDetailsLayout({
  children,
  params: { elementType, elementID },
}: {
  children: React.ReactNode,
  params: { elementType: string, elementID: string } 
}) {

  if (!isGenomicElementType(elementType)) {
    throw new Error("Unknown genomic element type: " + elementType)
  }

  return (
    <ElementDetailsLayout
      elementID={elementID}
      elementType={elementType}
    >
      {children}
    </ElementDetailsLayout>
  )
}
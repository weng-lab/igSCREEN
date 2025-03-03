import ElementDetailsLayout from "common/ElementDetails/ElementDetailsLayout"
import { isValidGenomicElement } from "types/globalTypes"

/**
 * Note: /[elementType]/[elementID] has no page.tsx since this route
 * is redirected to a defined tab based on configuration in next.config.mjs
 */
export default function IcreDetailsLayout({
  children,
  params: { elementType, elementID },
}: {
  children: React.ReactNode,
  params: { elementType: string, elementID: string } 
}) {

  if (!isValidGenomicElement(elementType)) {
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
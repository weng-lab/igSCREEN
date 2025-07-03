'use client'
import ElementDetailsLayout from "common/ElementDetails/ElementDetailsLayout"
import { isValidGenomicElement } from "types/globalTypes"
import { useContext, useEffect, use } from "react";
import { OpenElementsContext } from "common/OpenElementsContext";

export default function IcreDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: Promise<{ elementType: string, elementID: string }> 
}) {
  const { elementType, elementID } = use(params);

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
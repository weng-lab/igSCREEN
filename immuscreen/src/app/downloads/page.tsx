'use client'
import * as React from "react"
import CellTypeTree from "./dendrogram"
import { useState } from "react"

export interface CellTypes {
  bulk_b: boolean
}

export default async function Downloads({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [selectedCells, setSelectedCells] = useState<CellTypes>({bulk_b: false})

  return (
    <main>
      <CellTypeTree width={1000} height={1000} selectedCells={selectedCells} setSelectedCells={setSelectedCells}/>
    </main>
  )
}

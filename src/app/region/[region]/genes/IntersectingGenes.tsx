'use client'
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { GenomicRange } from "types/globalTypes"


const IntersectionGenes = (props: { region: GenomicRange }) => {

  return (
    <DataTable
      rows={[]}
      searchable
      columns={[
        {
          header: "Name",
          value: (row) => 0
        }
      ]}
      tableTitle="Intersecting Genes"
      onRowClick={(row) => window.alert("clicked")}
      itemsPerPage={[10, 25, 50]}
    />
  )
}

export default IntersectionGenes
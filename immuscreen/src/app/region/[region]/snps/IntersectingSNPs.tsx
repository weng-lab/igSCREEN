'use client'
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { GenomicRange } from "types/globalTypes"


const IntersectingSNPs = (props: { region: GenomicRange }) => {

  return (
    <DataTable
      rows={[]}
      searchable
      columns={[
        {
          header: "rsID",
          value: (row) => 0
        }
      ]}
      tableTitle="Intersecting SNPs"
      onRowClick={(row) => window.alert("clicked")}
      itemsPerPage={[10, 25, 50]}
    />
  )
}

export default IntersectingSNPs
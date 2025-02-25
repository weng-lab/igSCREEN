'use client'

import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { CellQueryValue } from "app/celllineage/types"
import { ActiveCellTypesList } from "app/icres/utils"
import { getClassDisplayname } from "common/utility"
import { IntersectingIcresQuery } from "types/generated/graphql"


const IntersectingiCREs = (props: {data: IntersectingIcresQuery}) => {

  return (
    <DataTable
      rows={props.data.iCREQuery}
      columns={[
        {
          header: "Accession",
          value: (row) => row.accession
        },
        {
          header: "Class",
          value: (row) => getClassDisplayname(row.group)
        },
        {
          header: "Coordinates",
          value: (row) => `${row.coordinates.chromosome}:${row.coordinates.start.toLocaleString()}-${row.coordinates.end.toLocaleString()}`
        },
        {
          header: "Active Cell Types",
          tooltip: "Activity in cell types determined by aggregated ATAC-seq signal z-score of >1.64 (95th percentile)",
          value: (row) => row.celltypes?.length,
          render: (row) => <ActiveCellTypesList celltypes={row.celltypes as CellQueryValue[]} />
        }
      ]}
      tableTitle="Intersecting iCREs"
      onRowClick={(row) => window.alert("clicked" + row.accession)}
      itemsPerPage={[10, 25, 50]}
    />
  )
}

export default IntersectingiCREs
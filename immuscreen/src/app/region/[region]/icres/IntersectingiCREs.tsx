'use client'

import { useQuery } from "@apollo/client"
import { CircularProgress } from "@mui/material"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { CellQueryValue } from "app/celllineage/types"
import { ActiveCellTypesList, ActiveExperimentList } from "app/[elementType]/[elementID]/[tab]/_IcreTabs/utils"
import { getClassDisplayname } from "common/utility"
import { gql } from "types/generated/gql"
import { GenomicRange } from "types/globalTypes"
import { useRouter } from "next/navigation"

/**
 * @todo look into using the useIcreMetadata hook here to deduplicate
 */
const ICRES_QUERY = gql(`
  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {
    iCREQuery(coordinates: $coordinates) {
      accession
      group
      celltypes
      coordinates {
        start
        end
        chromosome
      }
    }
  }
`)

const ICRES_ACTIVE_EXPERIMENTS = gql(`
  query IcresActiveExperiments($accession: [String]) {
    calderoncorcesAtacQuery(accession: $accession) {
      grouping
      description
      name
      value
      icre
    }
  }
`)

type DataTableRow = {
  activeExps?: {
    [key: string]: {
      description: string;
      name: string;
      value: number;
    }[];
  };
  accession: string;
  group: string;
  celltypes?: Array<string | null> | null;
  coordinates: {
    start: number;
    end: number;
    chromosome: string;
  };
}


const IntersectingiCREs = (props: { region: GenomicRange }) => {

  const router = useRouter()

  const { loading, data, error } = useQuery(ICRES_QUERY, {
    variables: {
      coordinates: props.region
    }
  })

  const { data: data_experiments, loading: loading_experiments, error: error_experiments } = useQuery(ICRES_ACTIVE_EXPERIMENTS, {
    variables: {
      accession: data?.iCREQuery.map((x) => x.accession) || []
    },
    skip: !data,
  })

  const rowsNoExps = data?.iCREQuery || []

  const rowsWithExps = rowsNoExps.length > 0 && data_experiments && rowsNoExps.map((row) => {
    let activeExps: {
      [key: string]: {
        description: string,
        name: string,
        value: number
      }[]
    } = {}

    data_experiments.calderoncorcesAtacQuery.forEach(exp => {
      //Cutoff for experiment activity set at 1.64
      if (exp.icre === row.accession && exp.value > 1.64) {
        if (activeExps[exp.grouping]) {
          activeExps[exp.grouping] = [...activeExps[exp.grouping], exp]
        } else {
          activeExps[exp.grouping] = [exp]
        }
      }
    });

    return { ...row, activeExps: activeExps }
  })



  return (
    <DataTable<DataTableRow>
      rows={rowsWithExps || rowsNoExps}
      searchable
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
        },
        {
          header: "Active Experiments",
          tooltip: "Activity in individual experiments determined by an ATAC-seq signal z-score of >1.64 (95th percentile)",
          value: (row) => row?.activeExps ? Object.values(row.activeExps).flat().length : 0,
          render: (row) => {
            return (
              row?.activeExps ?
                <ActiveExperimentList activeExps={row.activeExps} />
                :
                <CircularProgress />
            )
          }
        },
      ]}
      tableTitle="Intersecting iCREs"
      onRowClick={(row) => router.push(`/icre/${row.accession}` )}
      itemsPerPage={[10, 25, 50]}
    />
  )
}

export default IntersectingiCREs
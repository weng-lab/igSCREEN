import { CellQueryValue } from "app/celllineage/types"


export type ICRE_Data = { accession: string, rdhs: string, celltypes: CellQueryValue[], coordinates: { chromosome: string, start: number, end: number, } }
export type Experiment_Data = { grouping: string, description: string, name: string, start: number, value: number }
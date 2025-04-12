import CellLineageTree from "common/components/CellLineageTree";
import { IcreActivityProps } from "./IcreActivity"
import { useIcreData } from "common/hooks/useIcreData";
import { Stack } from "@mui/material";
import { useMemo } from "react";
import ActiveCellTypesAccordion from "common/components/ActiveCellTypesAccordion";

export type IcreActivtyTreeProps = IcreActivityProps

const IcreActivityTree = ({ accession }: IcreActivtyTreeProps) => {
  
  const { data, loading, error } = useIcreData({ accession });

  const dnaseCellTypes = data.dnasecelltypes
  const atacCellTypes = data.ataccelltypes

  const rmStim = (cell: string) => cell.split("-")[0]

  // Tree needs input without stimulation on end of celltype
  const treeSelected = useMemo(() => [...dnaseCellTypes.map(rmStim), ...atacCellTypes.map(rmStim)], [atacCellTypes, dnaseCellTypes])

  return (
    <Stack spacing={2}>
      <div>
        <ActiveCellTypesAccordion celltypes={dnaseCellTypes} assay="DNase" />
        <ActiveCellTypesAccordion celltypes={atacCellTypes} assay="ATAC" />
      </div>
      <CellLineageTree width={830} height={1100} selected={treeSelected} uninteractive />
    </Stack>
  );
}

export default IcreActivityTree
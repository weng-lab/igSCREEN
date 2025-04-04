import NewCellTypeTree from "common/components/NewCellTypeTree";
import { IcreActivityProps, SharedIcreActivityPlotProps } from "./IcreActivity"
import { useIcreData } from "common/hooks/useIcreData";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export type IcreActivtyTreeProps = IcreActivityProps

const IcreActivityTree = ({ accession }: IcreActivtyTreeProps) => {
  
  const { data, loading, error } = useIcreData({ accession });

  const cellTypes = data.celltypes


  const uniqueCelltypes: [cell: string, stimulation: string][] = cellTypes.reduce((prev, curr) => {
    const cell = curr.split("-")[0]
    const stimulation = curr.split("-")[1]
    const existingEntry = prev.find(x => x[0] === cell)

    if (existingEntry){
      console.log(existingEntry)
      return [...prev.filter(y => y !== existingEntry), [cell, existingEntry[1] + ', ' + stimulation]]
    } else return [...prev, [cell, stimulation]]
  }, [])


  // Tree needs input without stimulation on end of celltype
  const cellTypesNoStim = cellTypes.map(x => x.split("-")[0])

  return (
    <Stack spacing={2}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          Active in {uniqueCelltypes.length} Cell Types
        </AccordionSummary>
        <AccordionDetails>
          {uniqueCelltypes.map((celltype, i) => (
            <Typography variant="body2" key={i}>
              {`${celltype[0]} - (${celltype[1]})`}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
      <NewCellTypeTree
        width={830}
        height={1100}
        onNodeClicked={(node) => window.alert(node.celltype)}
        selected={cellTypesNoStim}
      />
    </Stack>
  );
}

export default IcreActivityTree
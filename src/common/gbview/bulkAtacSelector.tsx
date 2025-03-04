import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { CellQueryValue, CellTypeStaticInfo } from "../../app/celllineage/types";
import { extractQueryValues, getCellDisplayName } from "../../app/celllineage/utils";
import { cellTypeStaticInfo } from "../consts";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

type ModalProps = {
  open: boolean
  onAccept: (cells: CellQueryValue[]) => void;
  onCancel: () => void;
  selected: CellQueryValue[];
}

const BulkAtacModal: React.FC<ModalProps> = (props: ModalProps) => {
  const currentlySelected = useMemo(() => {
    const x = {}
    Object.values(cellTypeStaticInfo).forEach((cellInfo: CellTypeStaticInfo) => {
      const queryVals = extractQueryValues(cellInfo, "B")
      queryVals.forEach(queryVal => {
        x[queryVal] = !!props.selected.find(x => x === queryVal)
      })
    })
    return x as { [key in CellQueryValue]: boolean }
  }, [cellTypeStaticInfo, props.selected])

  const [selectedCells, setSelectedCells] = useState<{ [key in CellQueryValue]: boolean }>(currentlySelected)

  //Set back state of selectedCells before closing
  const handleCancel = () => {
    setSelectedCells(currentlySelected)
    props.onCancel()
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCells({
      ...selectedCells,
      [event.target.name]: event.target.checked,
    });
  };

  const handleAccept = () => {
    props.onAccept([...Object.entries(selectedCells).filter(x => x[1]).map(x => x[0] as CellQueryValue)])
    props.onCancel()
  }

  const handleDeselectAll = () => {
    setSelectedCells(
      Object.fromEntries(
        Object.entries(selectedCells).map(x => [x[0], false])
      ) as { [key in CellQueryValue]: boolean }
    )
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleCancel}
    >
      <DialogTitle>Select Bulk ATAC tracks</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select tracks you wish to display:
        </DialogContentText>
        <FormGroup>
          {
            Object.entries(selectedCells).map(([queryVal, selected]: [CellQueryValue, boolean], i) =>
              <FormControlLabel
                key={i}
                control={
                  <Checkbox checked={selected} onChange={handleChange} name={queryVal} />
                }
                label={getCellDisplayName(queryVal, true, true) + (["HSC", "CD34_Cord_Blood", "CD34_Bone_Marrow"].find(x => x === queryVal) ? ` (${queryVal})` : '')}
              />
            )
          }
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeselectAll} disabled={Object.values(selectedCells).every(x => x === false)}>Deselect All</Button>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleAccept}>Accept</Button>
      </DialogActions>
    </Dialog>
  )
};

export default BulkAtacModal
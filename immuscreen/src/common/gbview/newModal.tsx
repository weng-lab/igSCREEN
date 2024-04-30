import { ChangeEvent, useMemo, useState } from "react";
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

const NewModal: React.FC<ModalProps> = (props: ModalProps) => {
  const initialSelection = {}
  Object.values(cellTypeStaticInfo).forEach((cellInfo: CellTypeStaticInfo) => {
    const queryVals = extractQueryValues(cellInfo, "B")
    queryVals.forEach(queryVal => {
      initialSelection[queryVal] = !!props.selected.find(x => x === queryVal)
    })
  })

  const [selectedCells, setSelectedCells] = useState<{ [key in CellQueryValue]: boolean }>(initialSelection as { [key in CellQueryValue]: boolean })

  const handleClose = () => {
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
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAccept}>Accept</Button>
      </DialogActions>
    </Dialog>
  )
};

export default NewModal
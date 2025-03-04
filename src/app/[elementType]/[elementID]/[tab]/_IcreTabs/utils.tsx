import { useState } from "react";
import { Experiment_Data } from "./types";
import { ExpandLess, ExpandMore, InfoOutlined } from "@mui/icons-material";
import { List, ListItemButton, ListItemText, Collapse, Tooltip, Stack } from "@mui/material";
import { experimentInfo } from "../../../../../common/consts";
import { CellQueryValue } from "../../../../celllineage/types";
import { getCellDisplayName } from "../../../../celllineage/utils";

type GroupListProps = { exps: { description: string, name: string, value: number }[], grouping: string }

const ExperimentGroupList = (props: GroupListProps) => {
  const [openGroup, setOpenGroup] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    setOpenGroup(!openGroup);
  };

  return (
    <List disablePadding>
      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
        <ListItemText primary={`${props.grouping} (${props.exps.length})`} />
        {openGroup ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openGroup} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} component="div" disablePadding>
          {
            props.exps.sort((a, b) => experimentInfo[a.name].order - experimentInfo[b.name].order).map((exp) =>
              <Tooltip key={exp.name} title={exp.description}>
                <Stack direction={"row"} alignItems={"center"}>
                  <ListItemText primary={"\u2022 " + exp.name} />
                  <InfoOutlined fontSize="small" />
                </Stack>
              </Tooltip>
            )
          }
        </List>
      </Collapse>
    </List>
  )
}

type ActiveExperimentListProps = { activeExps: { [tissue: string]: { description: string, name: string, value: number }[] } }

export const ActiveExperimentList = (props: ActiveExperimentListProps) => {
  const [open, setOpen] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    setOpen(!open);
  };

  return (
    <List disablePadding>
      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
        <ListItemText primary={"Active in " + Object.values(props.activeExps).flat().length + " experiments"} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} component="div" disablePadding>
          {
            Object.entries(props.activeExps).map(([grouping, exps]: [string, { description: string, name: string, value: number }[]]) =>
              <ExperimentGroupList key={grouping} exps={exps} grouping={grouping} />
            )
          }
        </List>
      </Collapse>
    </List>
  )
}

type ActiveCellTypesListProps = { celltypes: CellQueryValue[] }

export const ActiveCellTypesList: React.FC<ActiveCellTypesListProps> = (props: ActiveCellTypesListProps) => {
  const [open, setOpen] = useState(false)

  const celltypes = [... new Set(props.celltypes.map(x => getCellDisplayName(x, true)))].sort()

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    setOpen(!open);
  };

  return (
    <List disablePadding>
      <ListItemButton onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event)}>
        <ListItemText primary={"Active in " + celltypes.length + " immune cell types"} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} component="div" disablePadding>
          {
            celltypes.map((cell: string) =>
              <ListItemText key={cell} primary={"\u2022 " + cell} />
            )
          }
        </List>
      </Collapse>
    </List>
  )
}
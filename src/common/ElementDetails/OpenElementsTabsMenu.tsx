import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MenuList, ListItemIcon, ListItemText } from "@mui/material";
import { Category, Close } from "@mui/icons-material";

type OpenElementsTabsMenuProps = {
  handleCloseAll: () => void;
  handleSort: () => void;
};

const OpenElementsTabsMenu = (props: OpenElementsTabsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseAll = () => {
    props.handleCloseAll();
    handleCloseMenu();
  };

  const handleSort = () => {
    props.handleSort();
    handleCloseMenu();
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        component={MenuList}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleSort}>
          <ListItemIcon>
            <Category fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Sort Tabs</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseAll}>
          <ListItemIcon>
            <Close fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Close Rest</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default OpenElementsTabsMenu;

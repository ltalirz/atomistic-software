import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InfoIcon from "@mui/icons-material/Info";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TableChartIcon from "@mui/icons-material/TableChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import { NavLink, useLocation } from "react-router-dom";

export function MainListItems() {
  const { pathname } = useLocation();
  const isActive = (path) => {
    if (path === "/table")
      return pathname === "/" || pathname.startsWith("/table");
    return pathname.startsWith(path);
  };

  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton
          component={NavLink}
          to="/table"
          selected={isActive("/table")}
        >
          <ListItemIcon>
            <TableChartIcon />
          </ListItemIcon>
          <ListItemText primary="Table" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          component={NavLink}
          to="/trends"
          selected={isActive("/trends")}
        >
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Trends" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          component={NavLink}
          to="/stats"
          selected={isActive("/stats")}
        >
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          component={NavLink}
          to="/about"
          selected={isActive("/about")}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItemButton>
      </ListItem>
    </div>
  );
}

import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InfoIcon from "@mui/icons-material/Info";
// import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TableChartIcon from "@mui/icons-material/TableChart";
import TimelineIcon from "@mui/icons-material/Timeline";

export function MainListItems() {
  const [hash, setHash] = React.useState(
    typeof window !== "undefined"
      ? window.location.hash || "#/table"
      : "#/table"
  );

  React.useEffect(() => {
    const handler = () => setHash(window.location.hash || "#/table");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const isActive = (path) => {
    // path like '/table', '/trends', '/stats', '/about'
    if (path === "/table") {
      return hash === "#/" || hash.startsWith("#/table");
    }
    return hash.startsWith(`#${path}`);
  };

  return (
    <div>
      {/* Optional Home entry could map to table */}
      <ListItem
        button
        component={"a"}
        href={"#/table"}
        selected={isActive("/table")}
      >
        <ListItemIcon>
          <TableChartIcon />
        </ListItemIcon>
        <ListItemText primary="Table" />
      </ListItem>
      <ListItem
        button
        component={"a"}
        href={"#/trends"}
        selected={isActive("/trends")}
      >
        <ListItemIcon>
          <TimelineIcon />
        </ListItemIcon>
        <ListItemText primary="Trends" />
      </ListItem>
      <ListItem
        button
        component={"a"}
        href={"#/stats"}
        selected={isActive("/stats")}
      >
        <ListItemIcon>
          <EqualizerIcon />
        </ListItemIcon>
        <ListItemText primary="Statistics" />
      </ListItem>
      <ListItem
        button
        component={"a"}
        href={"#/about"}
        selected={isActive("/about")}
      >
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
    </div>
  );
}

// export const secondaryListItems = (
//   <div>
//     <ListSubheader inset>Saved reports</ListSubheader>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItem>
//   </div>
// );

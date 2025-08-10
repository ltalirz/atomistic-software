// Temporary: keep makeStyles via @mui/styles during migration
import { makeStyles } from "@mui/styles";

const drawerWidth = 170;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  // for statistics & about views
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "100%",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  // Compact filters styling for MultiCodeChart
  filterGroupColumnsAuto: {
    columnGap: 6,
    columnCount: 3,
    [theme.breakpoints.up("md")]: {
      columnCount: 4,
    },
  },
  filterGroupTwoCols: {
    columnGap: 6,
    columnCount: 2,
  },
  filterLabelCompact: {
    breakInside: "avoid",
    marginBottom: 2,
    display: "block",
    minHeight: "auto",
    "& .MuiIconButton-root": {
      padding: 6,
    },
    "& .MuiCheckbox-root": {
      padding: 6,
    },
    "& .MuiFormControlLabel-label": {
      fontSize: "0.8rem",
      lineHeight: 1.2,
    },
  },
  // Compact chips for Active codes list
  activeChipCompact: {
    margin: "2px 2px 0 0",
    height: 20,
    "& .MuiChip-label": {
      paddingLeft: 6,
      paddingRight: 6,
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: "0.78rem",
      lineHeight: 1.2,
    },
  },
}));

export default useStyles;

import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";

import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import { MainListItems } from "./components/Dashboard/listItems";

import { HashRouter as Router, Route } from "react-router-dom";
import useStyles from "./components/Dashboard/Styles";
import Table from "./components/Table";
import About from "./components/About";
import Statistics from "./components/Statistics";
import { SingleChart } from "./components/Chart";
import MultiCodeChart from "./components/MultiCodeChart";
import packageJson from "../package.json";
import { useTheme } from "@mui/material/styles";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href={packageJson.author.url} target="_blank">
        {packageJson.author.name}
      </Link>{" "}
      {new Date().getFullYear()}
      {". "}
      <Link
        href={packageJson.repository.url + "/commits/master"}
        target="_blank"
      >
        Changelog
      </Link>
      <Link href="https://zenodo.org/badge/latestdoi/327603600">
        <img
          className="zenodo"
          src="https://zenodo.org/badge/327603600.svg"
          alt="DOI"
        />
      </Link>
    </Typography>
  );
}

export default function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <MainListItems />
      </List>
    </div>
  );

  // const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Trends in atomistic simulation engines
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* Mobile drawer */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </Box>
        {/* Desktop drawer */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Box>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container maxWidth="xl" className={classes.container}>
          <Router basename="/">
            <Route exact path="/" component={Table} />
            <Route exact path="/table" component={Table} />
            <Route exact path="/charts/:code" component={SingleChart} />
            <Route exact path="/trends" component={MultiCodeChart} />
            <Route exact path="/about" component={About} />
            <Route exact path="/stats" component={Statistics} />
          </Router>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

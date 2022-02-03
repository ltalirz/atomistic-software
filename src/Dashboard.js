import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";


import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import { mainListItems } from "./components/Dashboard/listItems";

import { HashRouter as Router, Route } from "react-router-dom";
import useStyles from "./components/Dashboard/Styles";
import Table from "./components/Table";
import About from "./components/About";
import Statistics from "./components/Statistics";
import { SingleChart } from "./components/Chart";
import packageJson from "../package.json";
import { useTheme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        href={packageJson.author.url}
        target="_blank"
      >
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
      <List>{mainListItems}
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
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
      <div className={classes.toolbar} />
        <Container maxWidth="xl" className={classes.container}>
          <Router basename="/">
            <Route exact path="/" component={Table} />
            <Route exact path="/table" component={Table} />
            <Route exact path="/charts/:code" component={SingleChart} />
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

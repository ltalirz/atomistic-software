import React from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';

import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems } from './components/Dashboard/listItems';

import { HashRouter as Router, Route } from 'react-router-dom';
import useStyles from './components/Dashboard/Styles';
import Table from './components/Table';
import About from './components/About';
import Statistics from './components/Statistics';
import {SingleChart} from './components/Chart/single';
import packageJson from '../package.json';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        {packageJson.author.name}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <Link href="https://zenodo.org/badge/latestdoi/327603600"><img class="zenodo" src="https://zenodo.org/badge/327603600.svg" alt="DOI"/></Link>
    </Typography>
  );
}

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Trends in atomistic simulation engines
          </Typography>
          {
            // <IconButton color="inherit">
            //   <Badge badgeContent={4} color="secondary">
            //     <NotificationsIcon />
            //   </Badge>
            // </IconButton>
          }
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        {/* {<Divider />
        <List>{secondaryListItems}</List>} */}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Router basename='/'>
            {/* { <Container maxWidth={'lg'} style={{'textAlign': 'center'}}>} */}
            <Route exact path="/" component={Table} />
            <Route exact path="/table" component={Table} />
            <Route exact path="/charts/:code" component={SingleChart} />
            <Route exact path="/about" component={About} />
            <Route exact path="/stats" component={Statistics} />
            {/* { </Container>} */}
          </Router>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

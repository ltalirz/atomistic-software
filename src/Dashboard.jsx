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

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Table from "./components/Table.jsx";
import About from "./components/About.jsx";
import Statistics from "./components/Statistics";
import { SingleChart } from "./components/Chart";
import MultiCodeChart from "./components/MultiCodeChart";
import packageJson from "../package.json";
import { useTheme } from "@mui/material/styles";
import ToolbarSpacer from "@mui/material/Toolbar";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
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
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const drawerWidth = 170;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <ToolbarSpacer />
      <Divider />
      <List>
        <MainListItems />
      </List>
    </div>
  );

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Trends in atomistic simulation engines
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Drawer
              variant="permanent"
              open
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <ToolbarSpacer />
          <Container maxWidth="xl" sx={{ mb: 2 }}>
            <Routes>
              <Route path="/" element={<Table />} />
              <Route path="/table" element={<Table />} />
              <Route path="/charts/:code" element={<SingleChart />} />
              <Route path="/trends" element={<MultiCodeChart />} />
              <Route path="/about" element={<About />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="*" element={<Table />} />
            </Routes>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

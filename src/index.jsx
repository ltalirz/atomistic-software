import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import reportWebVitals from "./reportWebVitals";
import Dashboard from "./Dashboard.jsx";
import "./style.css";

const container = document.getElementById("root");
const root = createRoot(container);
const theme = createTheme();
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();

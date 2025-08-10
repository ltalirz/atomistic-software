import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";

import { getCodeCitations } from "./Config";
import codesData from "../data/codes.json";
import { nivoChart } from "./Chart";
import {
  getSelectedKeys,
  bulkSelect,
  updateToggle,
  filterCodesBySelections,
} from "../utils/filter";
import { normalizeCitationsForLogScale } from "../utils/chart";

function MultiCodeChart() {
  const [selectedTypes, setSelectedTypes] = useState({});
  const [selectedCosts, setSelectedCosts] = useState({});
  const [selectedSources, setSelectedSources] = useState({});
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCodeNames, setActiveCodeNames] = useState([]);
  const [maxActiveHeight, setMaxActiveHeight] = useState(null);

  // Refs to measure heights of sibling columns so Active codes list scrolls only when needed
  const typesRef = useRef(null);
  const costsRef = useRef(null);
  const sourcesRef = useRef(null);
  const activeColRef = useRef(null);

  // Get all available types, costs and sources from code data
  const { allTypes, allCosts, allSources } = React.useMemo(() => {
    const types = new Set();
    const costs = new Set();
    const sources = new Set();

    Object.values(codesData).forEach((code) => {
      if (code.types) {
        code.types.forEach((type) => types.add(type));
      }
      if (code.cost) {
        costs.add(code.cost);
      }
      if (code.source) {
        sources.add(code.source);
      }
    });

    return {
      allTypes: Array.from(types).sort(),
      allCosts: Array.from(costs).sort(),
      allSources: Array.from(sources).sort(),
    };
  }, []);

  // Initialize selected types, costs, and sources
  useEffect(() => {
    const initialTypes = {};
    allTypes.forEach((type) => {
      initialTypes[type] = false;
    });
    // Default select DFT if available
    if (initialTypes.DFT !== undefined) {
      initialTypes.DFT = true;
    }
    setSelectedTypes(initialTypes);

    // Initialize costs (none selected by default)
    const initCosts = bulkSelect(allCosts, false);
    setSelectedCosts(initCosts);

    // Initialize sources with 'copyleft' and 'permissive' preselected when present
    const initSources = bulkSelect(allSources, false);
    ["copyleft", "permissive"].forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(initSources, k)) {
        initSources[k] = true;
      }
    });
    setSelectedSources(initSources);
  }, [allTypes, allCosts, allSources]);

  // Compute max height for Active codes list based on tallest of the other filter columns
  useEffect(() => {
    const calcMax = () => {
      const h1 = typesRef.current ? typesRef.current.offsetHeight : 0;
      const h2 = costsRef.current ? costsRef.current.offsetHeight : 0;
      const h3 = sourcesRef.current ? sourcesRef.current.offsetHeight : 0;
      const maxFiltersHeight = Math.max(h1, h2, h3);
      if (!maxFiltersHeight) {
        setMaxActiveHeight(null);
        return;
      }
      const headerEl = activeColRef.current
        ? activeColRef.current.querySelector('h6, [role="heading"]')
        : null;
      const headerH = headerEl ? headerEl.offsetHeight : 0;
      // Subtract a small spacing buffer
      const allowed = Math.max(0, maxFiltersHeight - headerH - 8);
      setMaxActiveHeight(allowed || null);
    };

    calcMax();
    window.addEventListener("resize", calcMax);
    return () => window.removeEventListener("resize", calcMax);
  }, [selectedTypes, selectedCosts, selectedSources, activeCodeNames.length]);

  // Helper to know whether any filter is active
  const hasAnySelections = React.useCallback(() => {
    return (
      Object.values(selectedTypes).some(Boolean) ||
      Object.values(selectedCosts).some(Boolean) ||
      Object.values(selectedSources).some(Boolean)
    );
  }, [selectedTypes, selectedCosts, selectedSources]);

  // Extracted citation data processing
  const processCitationData = React.useCallback((codeNames) => {
    try {
      const citationsData = getCodeCitations(codeNames);
      if (!citationsData || !Array.isArray(citationsData)) {
        return [];
      }
      return normalizeCitationsForLogScale(citationsData);
    } catch (error) {
      console.error("Error processing citation data:", error);
      return [];
    }
  }, []);

  // Update chart data when selected types, costs, or sources change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const typesToInclude = getSelectedKeys(selectedTypes);
      const costsToInclude = getSelectedKeys(selectedCosts);
      const sourcesToInclude = getSelectedKeys(selectedSources);

      // If nothing selected, show empty chart
      if (
        typesToInclude.length === 0 &&
        costsToInclude.length === 0 &&
        sourcesToInclude.length === 0
      ) {
        setChartData([]);
        setActiveCodeNames([]);
        setIsLoading(false);
        return;
      }

      // Filter codes by selected types, costs, and sources
      const filteredCodes = filterCodesBySelections(codesData, {
        types: typesToInclude,
        costs: costsToInclude,
        sources: sourcesToInclude,
      });

      setActiveCodeNames(filteredCodes);

      const processedData = processCitationData(filteredCodes);
      setChartData(processedData);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedTypes, selectedCosts, selectedSources, processCitationData]);

  const handleTypeChange = (event) => {
    setSelectedTypes((prev) =>
      updateToggle(prev, event.target.name, event.target.checked)
    );
  };

  const handleCostChange = (event) => {
    setSelectedCosts((prev) =>
      updateToggle(prev, event.target.name, event.target.checked)
    );
  };

  const handleSourceChange = (event) => {
    setSelectedSources((prev) =>
      updateToggle(prev, event.target.name, event.target.checked)
    );
  };

  const handleSelectAll = (category) => {
    if (category === "types") {
      setSelectedTypes(bulkSelect(allTypes, true));
    } else if (category === "costs") {
      setSelectedCosts(bulkSelect(allCosts, true));
    } else if (category === "sources") {
      setSelectedSources(bulkSelect(allSources, true));
    }
  };

  const handleClearAll = (category) => {
    if (category === "types") {
      setSelectedTypes(bulkSelect(allTypes, false));
    } else if (category === "costs") {
      setSelectedCosts(bulkSelect(allCosts, false));
    } else if (category === "sources") {
      setSelectedSources(bulkSelect(allSources, false));
    }
  };

  const removeCode = (codeName) => {
    // First update the active code names list
    const filteredCodes = activeCodeNames.filter((name) => name !== codeName);
    setActiveCodeNames(filteredCodes);

    // Then update the chart data to match the updated active codes
    const updatedChartData = chartData.filter((item) => item.id !== codeName);
    setChartData(updatedChartData);
  };

  return (
    <div>
      <Paper
        sx={{
          p: 1.5,
          mb: 1.25,
          display: "flex",
          overflow: "auto",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={1} alignItems="stretch">
          {/* Type filters */}
          <Grid item xs={12} sm={6} md={3} ref={typesRef}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by code type:
            </Typography>
            <div style={{ display: "flex", marginBottom: "4px" }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleSelectAll("types")}
                style={{ marginRight: "4px", padding: "3px 8px" }}
              >
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleClearAll("types")}
                style={{ padding: "3px 8px" }}
              >
                Clear All
              </Button>
            </div>
            <FormGroup sx={{ columnGap: 0.75, columnCount: { xs: 3, md: 4 } }}>
              {allTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedTypes[type] || false}
                      onChange={handleTypeChange}
                      name={type}
                      color="primary"
                    />
                  }
                  sx={{
                    breakInside: "avoid",
                    mb: 0.5,
                    display: "block",
                    minHeight: "auto",

                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.8rem",
                      lineHeight: 1.2,
                    },
                  }}
                  label={<span>{type}</span>}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Cost filters */}
          <Grid item xs={12} sm={6} md={3} ref={costsRef}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by cost:
            </Typography>
            <div style={{ display: "flex", marginBottom: "4px" }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleSelectAll("costs")}
                style={{ marginRight: "4px", padding: "3px 8px" }}
              >
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleClearAll("costs")}
                style={{ padding: "3px 8px" }}
              >
                Clear All
              </Button>
            </div>
            <FormGroup sx={{ columnGap: 0.75, columnCount: 2 }}>
              {allCosts.map((cost) => (
                <FormControlLabel
                  key={cost}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedCosts[cost] || false}
                      onChange={handleCostChange}
                      name={cost}
                      color="primary"
                    />
                  }
                  sx={{
                    breakInside: "avoid",
                    mb: 0.5,
                    display: "block",
                    minHeight: "auto",

                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.8rem",
                      lineHeight: 1.2,
                    },
                  }}
                  label={<span>{cost}</span>}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Source filters */}
          <Grid item xs={12} sm={6} md={3} ref={sourcesRef}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by source availability:
            </Typography>
            <div style={{ display: "flex", marginBottom: "4px" }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleSelectAll("sources")}
                style={{ marginRight: "4px", padding: "3px 8px" }}
              >
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleClearAll("sources")}
                style={{ padding: "3px 8px" }}
              >
                Clear All
              </Button>
            </div>
            <FormGroup sx={{ columnGap: 0.75, columnCount: 2 }}>
              {allSources.map((source) => (
                <FormControlLabel
                  key={source}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedSources[source] || false}
                      onChange={handleSourceChange}
                      name={source}
                      color="primary"
                    />
                  }
                  sx={{
                    breakInside: "avoid",
                    mb: 0.5,
                    display: "block",
                    minHeight: "auto",

                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.8rem",
                      lineHeight: 1.2,
                    },
                  }}
                  label={<span>{source}</span>}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Active codes display and removal */}
          <Grid item xs={12} sm={6} md={3} ref={activeColRef}>
            <Typography variant="subtitle2" gutterBottom>
              Active codes ({activeCodeNames.length}):
            </Typography>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 2,
                rowGap: 0,
                overflowY: "auto",
                maxHeight: maxActiveHeight || undefined,
              }}
            >
              {activeCodeNames.length > 0 ? (
                activeCodeNames.map((codeName) => (
                  <Chip
                    key={codeName}
                    label={codeName}
                    onDelete={() => removeCode(codeName)}
                    sx={{
                      m: "2px 2px 0 0",
                      height: 20,
                      "& .MuiChip-label": {
                        px: 0.75,
                        py: 0.25,
                        fontSize: "0.78rem",
                        lineHeight: 1.2,
                      },
                    }}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No codes selected. Please select at least one filter option.
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: "flex",
          overflow: "auto",
          flexDirection: "column",
        }}
      >
        {isLoading ? (
          <Typography
            variant="body1"
            align="center"
            style={{ padding: "100px 0" }}
          >
            Loading citation data...
          </Typography>
        ) : chartData.length > 0 ? (
          nivoChart(chartData, "Citation Trends (log scale)", false, true, true)
        ) : (
          <Typography
            variant="body1"
            align="center"
            style={{ padding: "100px 0" }}
          >
            {hasAnySelections()
              ? "No citation data available for the selected filters"
              : "Select at least one filter option to view trends"}
          </Typography>
        )}
      </Paper>
    </div>
  );
}

export default MultiCodeChart;

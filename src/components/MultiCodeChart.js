import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import useStyles from "./Dashboard/Styles";

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
  const classes = useStyles();
  const [selectedTypes, setSelectedTypes] = useState({});
  const [selectedCosts, setSelectedCosts] = useState({});
  const [selectedSources, setSelectedSources] = useState({});
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCodeNames, setActiveCodeNames] = useState([]);

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

    setSelectedCosts(bulkSelect(allCosts, false));
    setSelectedSources(bulkSelect(allSources, false));
  }, [allTypes, allCosts, allSources]);

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
        className={classes.paper}
        style={{ marginBottom: "16px", padding: "12px" }}
      >
        <Grid container spacing={2}>
          {/* Type filters */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by code type:
            </Typography>
            <div style={{ display: "flex", marginBottom: "6px" }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleSelectAll("types")}
                style={{ marginRight: "6px" }}
              >
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleClearAll("types")}
              >
                Clear All
              </Button>
            </div>
            <FormGroup style={{ columnCount: 2, columnGap: "12px" }}>
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
                  style={{
                    breakInside: "avoid",
                    marginBottom: 4,
                    display: "block",
                  }}
                  label={<span style={{ fontSize: "0.92rem" }}>{type}</span>}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Cost filters */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by cost:
            </Typography>
            <div style={{ display: "flex", marginBottom: "6px" }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleSelectAll("costs")}
                style={{ marginRight: "6px" }}
              >
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleClearAll("costs")}
              >
                Clear All
              </Button>
            </div>
            <FormGroup>
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
                  style={{ marginBottom: 4 }}
                  label={<span style={{ fontSize: "0.92rem" }}>{cost}</span>}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Source filters */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by source availability:
            </Typography>
            <div style={{ display: "flex", marginBottom: "6px" }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleSelectAll("sources")}
                style={{ marginRight: "6px" }}
              >
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleClearAll("sources")}
              >
                Clear All
              </Button>
            </div>
            <FormGroup>
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
                  style={{ marginBottom: 4 }}
                  label={<span style={{ fontSize: "0.92rem" }}>{source}</span>}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Active codes display and removal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" gutterBottom>
              Active codes ({activeCodeNames.length}):
            </Typography>
            <div
              style={{
                maxHeight: "40vh",
                overflowY: "auto",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              {activeCodeNames.length > 0 ? (
                activeCodeNames.map((codeName) => (
                  <Chip
                    key={codeName}
                    label={codeName}
                    onDelete={() => removeCode(codeName)}
                    style={{ margin: 0 }}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No codes selected. Please select at least one filter option.
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Paper className={classes.paper}>
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

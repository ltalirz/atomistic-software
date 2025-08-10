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
    
    Object.values(codesData).forEach(code => {
      if (code.types) {
        code.types.forEach(type => types.add(type));
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
      allSources: Array.from(sources).sort()
    };
  }, []);

  // Initialize selected types, costs, and sources
  useEffect(() => {
    const initialTypes = {};
    allTypes.forEach(type => {
      initialTypes[type] = false;
    });
    // Default select DFT if available
    if (initialTypes.DFT !== undefined) {
      initialTypes.DFT = true;
    }
    setSelectedTypes(initialTypes);
    
    const initialCosts = {};
    allCosts.forEach(cost => {
      initialCosts[cost] = false;
    });
    setSelectedCosts(initialCosts);
    
    const initialSources = {};
    allSources.forEach(source => {
      initialSources[source] = false;
    });
    setSelectedSources(initialSources);
  }, [allTypes, allCosts, allSources]);

  // Update chart data when selected types, costs, or sources change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const typesToInclude = Object.keys(selectedTypes).filter(
        type => selectedTypes[type]
      );
      
      const costsToInclude = Object.keys(selectedCosts).filter(
        cost => selectedCosts[cost]
      );
      
      const sourcesToInclude = Object.keys(selectedSources).filter(
        source => selectedSources[source]
      );
      
      // If nothing selected, show empty chart
      if (typesToInclude.length === 0 && costsToInclude.length === 0 && sourcesToInclude.length === 0) {
        setChartData([]);
        setActiveCodeNames([]);
        setIsLoading(false);
        return;
      }
      
      // Filter codes by selected types, costs, and sources
      const filteredCodes = Object.keys(codesData).filter(codeName => {
        const code = codesData[codeName];
        
        // Type filter
        const typeMatch = typesToInclude.length === 0 || 
                         (code.types && code.types.some(type => typesToInclude.includes(type)));
        
        // Cost filter
        const costMatch = costsToInclude.length === 0 || 
                         (code.cost && costsToInclude.includes(code.cost));
        
        // Source filter
        const sourceMatch = sourcesToInclude.length === 0 || 
                           (code.source && sourcesToInclude.includes(code.source));
        
        return typeMatch && costMatch && sourceMatch;
      });

      console.log("Selected types:", typesToInclude);
      console.log("Selected costs:", costsToInclude);
      console.log("Selected sources:", sourcesToInclude);
      console.log("Filtered codes:", filteredCodes);
      
      setActiveCodeNames(filteredCodes);
      
      try {
        // Get citation data for filtered codes
        const citationsData = getCodeCitations(filteredCodes);
        console.log("Raw citations data:", citationsData);
        
        // Make sure we have valid citation data
        if (!citationsData || !Array.isArray(citationsData)) {
          console.error("Citation data is not valid:", citationsData);
          setChartData([]);
          setIsLoading(false);
          return;
        }
        
        // Process the data to ensure it's valid for the chart (no zero values for log scale)
        const processedData = citationsData.map(item => {
          if (!item || !item.id || !item.data || !Array.isArray(item.data)) {
            console.error("Invalid citation item:", item);
            return null;
          }
          
          // For log scale, we need to ensure no zero or negative values
          const validData = item.data.filter(point => 
            point && 
            typeof point.x !== 'undefined' && 
            typeof point.y === 'number' && 
            point.y > 0
          );
          
          // Only include codes that have at least one valid data point
          if (validData.length > 0) {
            return {
              id: item.id,
              data: validData
            };
          }
          return null;
        }).filter(Boolean); // Remove any null entries
        
        console.log("Processed chart data:", processedData);
        setChartData(processedData);
      } catch (error) {
        console.error("Error processing citation data:", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedTypes, selectedCosts, selectedSources]);

  const handleTypeChange = (event) => {
    setSelectedTypes(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked
    }));
  };

  const handleCostChange = (event) => {
    setSelectedCosts(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked
    }));
  };

  const handleSourceChange = (event) => {
    setSelectedSources(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked
    }));
  };

  const handleSelectAll = (category) => {
    if (category === 'types') {
      const newSelectedTypes = {};
      allTypes.forEach(type => {
        newSelectedTypes[type] = true;
      });
      setSelectedTypes(newSelectedTypes);
    } else if (category === 'costs') {
      const newSelectedCosts = {};
      allCosts.forEach(cost => {
        newSelectedCosts[cost] = true;
      });
      setSelectedCosts(newSelectedCosts);
    } else if (category === 'sources') {
      const newSelectedSources = {};
      allSources.forEach(source => {
        newSelectedSources[source] = true;
      });
      setSelectedSources(newSelectedSources);
    }
  };

  const handleClearAll = (category) => {
    if (category === 'types') {
      const newSelectedTypes = {};
      allTypes.forEach(type => {
        newSelectedTypes[type] = false;
      });
      setSelectedTypes(newSelectedTypes);
    } else if (category === 'costs') {
      const newSelectedCosts = {};
      allCosts.forEach(cost => {
        newSelectedCosts[cost] = false;
      });
      setSelectedCosts(newSelectedCosts);
    } else if (category === 'sources') {
      const newSelectedSources = {};
      allSources.forEach(source => {
        newSelectedSources[source] = false;
      });
      setSelectedSources(newSelectedSources);
    }
  };

  const removeCode = (codeName) => {
    // First update the active code names list
    const filteredCodes = activeCodeNames.filter(name => name !== codeName);
    setActiveCodeNames(filteredCodes);
    
    // Then update the chart data to match the updated active codes
    const updatedChartData = chartData.filter(item => item.id !== codeName);
    setChartData(updatedChartData);
  };

  return (
    <div>
    <Paper className={classes.paper} style={{ marginBottom: '16px', padding: '12px' }}>
        <Grid container spacing={2}>
          {/* Type filters */}
          <Grid item xs={12} sm={6} md={3}>
      <Typography variant="subtitle2" gutterBottom>Filter by code type:</Typography>
      <div style={{ display: 'flex', marginBottom: '6px' }}>
              <Button 
                size="small" 
                variant="outlined" 
                color="primary" 
                onClick={() => handleSelectAll('types')}
        style={{ marginRight: '6px' }}
              >
                Select All
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleClearAll('types')}
              >
                Clear All
              </Button>
            </div>
      <FormGroup style={{ columnCount: 2, columnGap: '12px' }}>
              {allTypes.map(type => (
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
          style={{ breakInside: 'avoid', marginBottom: 4, display: 'block' }}
          label={<span style={{ fontSize: '0.92rem' }}>{type}</span>}
                />
              ))}
            </FormGroup>
          </Grid>
          
          {/* Cost filters */}
          <Grid item xs={12} sm={6} md={3}>
      <Typography variant="subtitle2" gutterBottom>Filter by cost:</Typography>
      <div style={{ display: 'flex', marginBottom: '6px' }}>
              <Button 
                size="small" 
                variant="outlined" 
                color="primary" 
                onClick={() => handleSelectAll('costs')}
        style={{ marginRight: '6px' }}
              >
                Select All
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleClearAll('costs')}
              >
                Clear All
              </Button>
            </div>
            <FormGroup>
              {allCosts.map(cost => (
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
          label={<span style={{ fontSize: '0.92rem' }}>{cost}</span>}
                />
              ))}
            </FormGroup>
          </Grid>
          
          {/* Source filters */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" gutterBottom>Filter by source availability:</Typography>
            <div style={{ display: 'flex', marginBottom: '6px' }}>
              <Button 
                size="small" 
                variant="outlined" 
                color="primary" 
                onClick={() => handleSelectAll('sources')}
                style={{ marginRight: '6px' }}
              >
                Select All
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleClearAll('sources')}
              >
                Clear All
              </Button>
            </div>
            <FormGroup>
              {allSources.map(source => (
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
                  label={<span style={{ fontSize: '0.92rem' }}>{source}</span>}
                />
              ))}
            </FormGroup>
          </Grid>
          
          {/* Active codes display and removal */}
          <Grid item xs={12} sm={6} md={3}>
      <Typography variant="subtitle2" gutterBottom>Active codes ({activeCodeNames.length}):</Typography>
            <div style={{ maxHeight: '40vh', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {activeCodeNames.length > 0 ? (
                activeCodeNames.map(codeName => (
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
          <Typography variant="body1" align="center" style={{ padding: '100px 0' }}>
            Loading citation data...
          </Typography>
        ) : chartData.length > 0 ? (
          nivoChart(chartData, "Citation Trends (log scale)", false, true, true)
        ) : (
          <Typography variant="body1" align="center" style={{ padding: '100px 0' }}>
            {Object.values(selectedTypes).some(v => v) || Object.values(selectedCosts).some(v => v) || Object.values(selectedSources).some(v => v)
              ? "No citation data available for the selected filters"
              : "Select at least one filter option to view trends"}
          </Typography>
        )}
      </Paper>
    </div>
  );
}

export default MultiCodeChart;

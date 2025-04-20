import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import useStyles from "./Dashboard/Styles";

import { getCodeCitations } from "./Config";
import codesData from "../data/codes.json";
import { nivoChart } from "./Chart";

function MultiCodeChart() {
  const classes = useStyles();
  const [selectedTypes, setSelectedTypes] = useState({});
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get all available types from code data
  const allTypes = React.useMemo(() => {
    const types = new Set();
    Object.values(codesData).forEach(code => {
      if (code.types) {
        code.types.forEach(type => types.add(type));
      }
    });
    return Array.from(types).sort();
  }, []);

  // Initialize selected types
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
  }, [allTypes]);

  // Update chart data when selected types change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const typesToInclude = Object.keys(selectedTypes).filter(
        type => selectedTypes[type]
      );
      
      // If no types selected, show empty chart
      if (typesToInclude.length === 0) {
        setChartData([]);
        setIsLoading(false);
        return;
      }
      
      // Filter codes by selected types
      const filteredCodes = Object.keys(codesData).filter(codeName => {
        const code = codesData[codeName];
        return code.types && code.types.some(type => typesToInclude.includes(type));
      });

      console.log("Selected types:", typesToInclude);
      console.log("Filtered codes:", filteredCodes);
      
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
  }, [selectedTypes]);

  const handleTypeChange = (event) => {
    setSelectedTypes(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked
    }));
  };

  return (
    <div>
      <Typography variant="h6" component="h2" gutterBottom>
        Citation Trends by Code Type
      </Typography>
      <Paper className={classes.paper} style={{ marginBottom: '20px', padding: '16px' }}>
        <Typography variant="subtitle1">Filter by code type:</Typography>
        <FormGroup row>
          {allTypes.map(type => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedTypes[type] || false}
                  onChange={handleTypeChange}
                  name={type}
                  color="primary"
                />
              }
              label={type}
            />
          ))}
        </FormGroup>
      </Paper>

      <Box sx={{ width: "100%", minHeight: "500px" }}>
        <Paper className={classes.paper}>
          {isLoading ? (
            <Typography variant="body1" align="center" style={{ padding: '100px 0' }}>
              Loading citation data...
            </Typography>
          ) : chartData.length > 0 ? (
            nivoChart(chartData, "Citation Trends (log scale)", true, true)
          ) : (
            <Typography variant="body1" align="center" style={{ padding: '100px 0' }}>
              {Object.values(selectedTypes).some(v => v) 
                ? "No citation data available for the selected code types" 
                : "Select at least one code type to view trends"}
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
}

export default MultiCodeChart;

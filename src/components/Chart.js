import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Title from "./Dashboard/Title";
import useStyles from "./Dashboard/Styles";

import { ResponsiveLine } from "@nivo/line";

import { getCodeCitations } from "./Config";
import codes from "../data/codes.json";
import { buildScholarUrl } from "../utils/scholar";
import { LOG_Y_MIN } from "../utils/chart";
import { useParams } from "react-router-dom";

const THEME = {
  axis: {
    legend: {
      text: {
        fontSize: "14px",
      },
    },
  },
};

function getTitle(codeName, citations) {
  /**
   * Return title for chart.
   */
  let reverseCitations = [];
  let yearBegin = 0;
  const minCitations = 10;
  // go backwards; stop when hitting 10 citations or lower
  for (const point of citations.slice().reverse()) {
    if (point["y"] < minCitations) {
      break;
    }
    reverseCitations.push(point["y"]);
    yearBegin = point["x"];
  }

  // Need at least two years with > minCitations
  if (reverseCitations.length < 2) {
    return codeName;
  }

  const ratio = reverseCitations[0] / reverseCitations.slice(-1)[0];
  const annualGrowth =
    (Math.pow(ratio, 1.0 / (reverseCitations.length - 1)) - 1) * 100;
  const title =
    codeName +
    " " +
    annualGrowth.toFixed(1) +
    "% growth (year-over-year) since " +
    yearBegin;

  return title;
}

function SingleChart() {
  /**
   * Return chart for single code.
   *
   * Name of code is parsed from URI.
   */

  let codeName = decodeURIComponent(useParams()["code"]);
  const series = getCodeCitations([codeName]);
  const points = Array.isArray(series) && series.length > 0 ? series[0].data : [];
  const title = getTitle(codeName, points);
  const classes = useStyles();

  const data = { id: codeName, data: points };

  return (
    <Box
      // note: for some reason, 100% has no effect
      sx={{ width: "clamp(520px, 99%, 800px)" }}>
      <Paper className={classes.paper}>
  {nivoChart([data], title, false, false, true)}
      </Paper>
    </Box>
  );
}

function nivoChart(data, title, legend = true, logScale = false, clickable = false) {
  /**
   * Return nivo line-chart with default formatting for given data and title.
   */
  let legend_list = [];
  let margin_right = 50;
  
  // For the MultiCodeChart page, we'll drop the legend even if legend=true is passed
  // This is detected based on the logScale parameter which is only used for the trends page
  if (legend && !logScale) {
    legend_list = [
      {
        anchor: "top-left",
        direction: "column",
        justify: false,
        translateX: 10,
        translateY: 10,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ];
  }

  // Validate data to ensure it contains points with valid coordinates
  const validData = data.map(series => {
    if (!series.data || !Array.isArray(series.data)) {
      return { ...series, data: [] };
    }
    // Filter out any data points with missing or invalid x or y values
    const validPoints = series.data.filter(
      point => point && typeof point.x !== 'undefined' && 
               (logScale ? point.y >= LOG_Y_MIN : typeof point.y !== 'undefined')
    ).sort((a, b) => {
      const ax = typeof a.x === 'string' ? parseInt(a.x, 10) : a.x;
      const bx = typeof b.x === 'string' ? parseInt(b.x, 10) : b.x;
      return ax - bx;
    });
    return { ...series, data: validPoints };
  }).filter(series => series.data.length > 0);

  // Calculate max value for setting y-axis ticks and add 10% padding
  const maxYValue = validData.reduce((max, series) => {
    const seriesMax = series.data.reduce((m, point) => Math.max(m, point.y), 0);
    return Math.max(max, seriesMax);
  }, 0);
  
  // Add 10% padding to max value to prevent cutting off
  const maxWithPadding = maxYValue * 1.1;

  // Configure Y scale based on logScale parameter
  const yScale = logScale
    ? {
        type: "log",
        base: 10,
        min: LOG_Y_MIN,  // Named constant for log scale minimum
        max: maxWithPadding,
        stacked: false,
        reverse: false,
      }
    : {
        type: "linear",
        min: 0,
        max: maxWithPadding,
        stacked: false,
        reverse: false,
      };

  // Function to format numbers with apostrophes (e.g., 10'000)
  const formatNumber = value => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  // Custom tick values for log scale to only show decades
  const getLogTickValues = (min, max) => {
    const tickValues = [];
    const minExp = Math.floor(Math.log10(min));
    const maxExp = Math.ceil(Math.log10(max));
    
    for (let i = minExp; i <= maxExp; i++) {
      const value = Math.pow(10, i);
      if (value >= min) {
        tickValues.push(value);
      }
    }
    
    // Add LOG_Y_MIN as the first tick if it's our min value
    if (min === LOG_Y_MIN && !tickValues.includes(LOG_Y_MIN)) {
      tickValues.unshift(LOG_Y_MIN);
    }
    
    return tickValues;
  };

  // If no valid data, display a message instead of an empty chart
  if (validData.length === 0) {
    return (
      <React.Fragment>
        <Title>{title}</Title>
        <div className="chart" style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>No valid data available for the selected options</p>
        </div>
      </React.Fragment>
    );
  }

  // Get tick values for log scale
  const tickValues = logScale ? getLogTickValues(LOG_Y_MIN, maxWithPadding) : undefined;

  return (
    <React.Fragment>
      <Title>{title}</Title>
  <div className={"chart" + (clickable ? " clickable-chart" : "")}>
        <ResponsiveLine
          title={title}
          data={validData}
          margin={{ top: 20, right: margin_right, bottom: 50, left: 70 }}
          xScale={{ type: "linear", min: "auto", max: "auto" }}
          yScale={yScale}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            legend: "Year",
            legendOffset: 36,
            legendPosition: "middle",
            format: "d",
          }}
          axisLeft={{
            orient: "left",
            legend: "Citations per year (Google Scholar)",
            legendOffset: -55,
            legendPosition: "middle",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: value => formatNumber(value),
            tickValues: tickValues
          }}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          enableCrosshair={true}
          useMesh={true}
          tooltip={({ point }) => (
            <div style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
              boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
              color: '#222',
              fontSize: '0.8em'
            }}>
              <strong>{point.serieId}</strong>
              <br />
              Year: {point.data.x}
              <br />
              Citations: {formatNumber(point.data.y)}
            </div>
          )}
          crosshairType="cross"
          legends={legend_list}
          animate={false}
          theme={THEME}
          onClick={(point) => {
            if (!point || !point.data) return;
            const year = typeof point.data.x === "string" ? parseInt(point.data.x, 10) : point.data.x;
            const codeName = point.serieId;
            const meta = codes[codeName];
            const url = buildScholarUrl(meta, year);
            if (url) {
              window.open(url, "_blank", "noopener,noreferrer");
            }
          }}
        />
      </div>
    </React.Fragment>
  );
}

export { SingleChart, nivoChart };

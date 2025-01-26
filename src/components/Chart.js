import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Title from "./Dashboard/Title";
import useStyles from "./Dashboard/Styles";

import { ResponsiveLine } from "@nivo/line";

import { getCodeCitations } from "./Config";
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
  const citations = getCodeCitations([codeName]);
  const title = getTitle(codeName, citations);
  const classes = useStyles();

  const data = { id: codeName, data: citations };

  return (
    <Box
      // note: for some reason, 100% has no effect
      sx={{ width: "clamp(520px, 99%, 800px)" }}>
      <Paper className={classes.paper}>
        {nivoChart([data], title, false)}
      </Paper>
    </Box>
  );
}

function nivoChart(data, title, legend = true) {
  /**
   * Return nivo line-chart with default formatting for given data and title.
   */
  let legend_list = [];
  let margin_right = 50;
  if (legend) {
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

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <div className="chart">
        <ResponsiveLine
          title={title}
          data={data}
          margin={{ top: 20, right: margin_right, bottom: 50, left: 70 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            legend: "Year",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            legend: "Citations per year (Google Scholar)",
            legendOffset: -55,
            legendPosition: "middle",
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          enableCrosshair={true}
          useMesh={true}
          legends={legend_list}
          animate={false}
          theme={THEME}
        />
      </div>
    </React.Fragment>
  );
}

export { SingleChart, nivoChart };

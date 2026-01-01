import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Title from "./Dashboard/Title";
import {
  CUTOFF,
  YEARS,
  CODES_BY_YEAR,
  getData,
  yearToRange,
} from "./Config";
import { nivoChart } from "./Chart";
import { aggregateSeriesTimeAware } from "../utils/chart";
import citations from "../data/citations.json";
// import { Card } from '@material-ui/core';

function citationGrowth(year) {
  /**
   * Compute citation growth for given year with respect to previous one.
   */

  const dataNew = getData(year);
  const dataOld = getData(year - 1);

  let data = {
    total: [],
    absoluteGrowth: [],
    relativeGrowth: [],
    typeCounts: [],
  };
  let delta = 0;
  let codeName = "";

  dataNew.forEach((dNew, index) => {
    codeName = dNew["name"];
    delta = dNew["citations"] - dataOld[index]["citations"];
    data["absoluteGrowth"].push([codeName, delta]);
    data["total"].push([codeName, dNew["citations"]]);

    if (dataNew[index]["citations"] < CUTOFF) {
      // We require at least 100 citations for analyzing growth
      data["relativeGrowth"].push([codeName, 0]);
    } else {
      const factor = delta / parseFloat(dataOld[index]["citations"]);
      data["relativeGrowth"].push([codeName, factor]);
    }

    // add code count to
    for (const type of dNew["types"]) {
      if (type in data["typeCounts"]) {
        data["typeCounts"][type] += 1;
      } else {
        data["typeCounts"][type] = 1;
      }
    }
  });

  data["absoluteGrowth"]
    .sort((a, b) => {
      return a[1] - b[1];
    })
    .reverse();
  data["relativeGrowth"]
    .sort((a, b) => {
      return a[1] - b[1];
    })
    .reverse();
  data["total"]
    .sort((a, b) => {
      return a[1] - b[1];
    })
    .reverse();

  return data;
}

function costGraph() {
  /**
   * Citation trend by price (free/commercial).
   * Uses time-aware aggregation to account for cost changes over time.
   */

  // Careful: it seems the legend coloring does not match the one of the graph automatically
  let groups = {
    "Free (general)": ["free"],
    "Free (academia)": ["free (academia)"],
    "Free (sum)": ["free", "free (academia)"],
    Commercial: ["commercial"],
  };

  // Use time-aware aggregator to correctly handle cost changes over time
  let lines = [];
  for (const group in groups) {
    const aggregated = aggregateSeriesTimeAware(
      CODES_BY_YEAR,
      citations,
      { cost: groups[group] },
      YEARS,
      yearToRange
    );
    lines.push({ id: group, data: aggregated });
  }
  return nivoChart(lines, "");
}

function sourceGraph() {
  /**
   * Citation trend by source code handling.
   * Uses time-aware aggregation to account for license changes over time.
   */

  // Careful: it seems the legend coloring does not match the one of the graph automatically
  let groups = {
    "Closed source": ["closed"],
    "Open-source": ["copyleft", "permissive"],
    "Source available": ["copyleft", "permissive", "available"],
  };

  // Use time-aware aggregator to correctly handle license changes over time
  let lines = [];
  for (const group in groups) {
    const aggregated = aggregateSeriesTimeAware(
      CODES_BY_YEAR,
      citations,
      { source: groups[group] },
      YEARS,
      yearToRange
    );
    lines.push({ id: group, data: aggregated });
  }
  return nivoChart(lines, "");
}

function chartLink(codeName) {
  /**
   * Return hyperlink to citation chart for given code name.
   */
  return <a href={"#/charts/" + encodeURIComponent(codeName)}>{codeName}</a>;
}

function totalList(data) {
  return (
    <Typography component="div" variant="subtitle1">
      <ol>
        {data.map((line, idx) => (
          <li key={`${line[0]}-${line[1]}-${idx}`}>
            {chartLink(line[0])}
            {": " + line[1] + "\n"}
          </li>
        ))}
      </ol>
    </Typography>
  );
}

function absoluteGrowthList(data) {
  return (
    <Typography component="div" variant="subtitle1">
      <ol>
        {data.map((line, idx) => (
          <li key={`${line[0]}-${line[1]}-${idx}`}>
            {chartLink(line[0])}
            {": +" + line[1] + "\n"}
          </li>
        ))}
      </ol>
    </Typography>
  );
}

function relativeGrowthList(data) {
  return (
    <Typography component="div" variant="subtitle1">
      <ol>
        {data.map((line, idx) => (
          <li key={`${line[0]}-${line[1]}-${idx}`}>
            {chartLink(line[0])}
            {": +" + parseInt(line[1] * 100) + "%\n"}
          </li>
        ))}
      </ol>
    </Typography>
  );
}

// Breakpoint sizes: xs, sm, md, lg, xl and xxl

function Card(title, message, footnote = "", widthSmall, widthLarge = null) {
  /**
   * Returns Grid component wrapped in Paper.
   *
   * @param title - Title of card
   * @param message - Content of the card
   * @param footnote - Display below content
   * @param widthSmall - Width of card when viewpoint is small
   * @param widthLarge - Width of card when viewpoint is large
   */
  if (!widthSmall) {
    widthSmall = widthLarge;
  }
  return [
    <Grid
      key={`card-${title}`}
      item
      xs={widthSmall}
      sm={widthSmall}
      md={widthLarge}
    >
      <Paper
        sx={{
          p: 2,
          display: "flex",
          overflow: "auto",
          flexDirection: "column",
        }}
      >
        <React.Fragment>
          <Title>{title}</Title>
          {message}
          <Typography color="text.secondary">{footnote}</Typography>
        </React.Fragment>
      </Paper>
    </Grid>,
  ];
}

let CURRENT_YEAR = YEARS.slice(-1)[0];
let GROWTH = citationGrowth(CURRENT_YEAR);

export default function Home() {
  // {Card("Simulation engines", typeList(GROWTH['typeCounts']), "Number of simulation engines per method.", 4)}
  return (
    <Grid container spacing={3}>
      {Card(
        "Highly cited in " + CURRENT_YEAR,
        totalList(GROWTH["total"].slice(0, 10)),
        "",
        10,
        4
      )}
      {Card(
        "High citation growth " + CURRENT_YEAR,
        absoluteGrowthList(GROWTH["absoluteGrowth"].slice(0, 10)),
        "With respect to " + (CURRENT_YEAR - 1) + ".",
        10,
        4
      )}
      {Card(
        "High relative citation growth " + CURRENT_YEAR,
        relativeGrowthList(GROWTH["relativeGrowth"].slice(0, 10)),
        "With respect to " + (CURRENT_YEAR - 1) + ".",
        10,
        4
      )}
      {Card("Cost: commercial vs free engines", costGraph(), "", 12, 10)}
      {Card(
        'Source availability: closed, "available", and open',
        sourceGraph(),
        '"Source available" includes all engines whose source code can be obtained for free or for a fee. ' +
          '"Open-source" engines are the subset of source-available engines with OSI-approved licenses.',
        12,
        10
      )}
    </Grid>
  );
}

import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Title from "./Dashboard/Title";

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
  let reverseCitations = [];
  let yearBegin = 0;
  const minCitations = 10;
  for (const point of citations.slice().reverse()) {
    if (point["y"] < minCitations) {
      break;
    }
    reverseCitations.push(point["y"]);
    yearBegin = point["x"];
  }
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
  let codeName = decodeURIComponent(useParams()["code"]);
  const series = getCodeCitations([codeName]);
  const points = Array.isArray(series) && series.length > 0 ? series[0].data : [];
  const title = getTitle(codeName, points);

  const data = { id: codeName, data: points };

  return (
    <Box sx={{ width: "clamp(520px, 99%, 800px)" }}>
      <Paper sx={{ p: 2, display: "flex", overflow: "auto", flexDirection: "column" }}>
        {nivoChart([data], title, false, false, true)}
      </Paper>
    </Box>
  );
}

function nivoChart(data, title, legend = true, logScale = false, clickable = false) {
  let legend_list = [];
  let margin_right = 50;
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
          { on: "hover", style: { itemBackground: "rgba(0, 0, 0, .03)", itemOpacity: 1 } },
        ],
      },
    ];
  }

  const validData = data
    .map((series) => {
      if (!series.data || !Array.isArray(series.data)) {
        return { ...series, data: [] };
      }
      const validPoints = series.data
        .filter(
          (point) =>
            point &&
            typeof point.x !== "undefined" &&
            (logScale ? point.y >= LOG_Y_MIN : typeof point.y !== "undefined")
        )
        .sort((a, b) => {
          const ax = typeof a.x === "string" ? parseInt(a.x, 10) : a.x;
          const bx = typeof b.x === "string" ? parseInt(b.x, 10) : b.x;
          return ax - bx;
        });
      return { ...series, data: validPoints };
    })
    .filter((series) => series.data.length > 0);

  const maxYValue = validData.reduce((max, series) => {
    const seriesMax = series.data.reduce((m, point) => Math.max(m, point.y), 0);
    return Math.max(max, seriesMax);
  }, 0);
  const maxWithPadding = maxYValue * 1.1;

  const yScale = logScale
    ? { type: "log", base: 10, min: LOG_Y_MIN, max: maxWithPadding, stacked: false, reverse: false }
    : { type: "linear", min: 0, max: maxWithPadding, stacked: false, reverse: false };

  const formatNumber = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

  const getLogTickValues = (min, max) => {
    const tickValues = [];
    const minExp = Math.floor(Math.log10(min));
    const maxExp = Math.ceil(Math.log10(max));
    for (let i = minExp; i <= maxExp; i++) {
      const value = Math.pow(10, i);
      if (value >= min) tickValues.push(value);
    }
    if (min === LOG_Y_MIN && !tickValues.includes(LOG_Y_MIN)) tickValues.unshift(LOG_Y_MIN);
    return tickValues;
  };

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
          axisBottom={{ orient: "bottom", legend: "Year", legendOffset: 36, legendPosition: "middle", format: "d" }}
          axisLeft={{
            orient: "left",
            legend: "Citations per year (Google Scholar)",
            legendOffset: -55,
            legendPosition: "middle",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: (value) => formatNumber(value),
            tickValues: tickValues,
          }}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          enableCrosshair={true}
          useMesh={true}
          tooltip={({ point }) => {
            const year = point.data.xFormatted ?? point.data.x;
            const value = point.data.yFormatted ?? point.data.y;
            return (
              <div style={{ background: "#fff", padding: "6px 8px", border: `2px solid ${point.serieColor}` , borderRadius: 4, boxShadow: "0 2px 6px rgba(0,0,0,0.2)", color: "#333", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: point.serieColor, display: "inline-block" }} />
                  <strong>{point.serieId}</strong>
                </div>
                <div>Year: {year}</div>
                <div>Citations: {formatNumber(value)}</div>
              </div>
            );
          }}
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
            if (url) window.open(url, "_blank", "noopener,noreferrer");
          }}
        />
      </div>
    </React.Fragment>
  );
}

export { SingleChart, nivoChart };

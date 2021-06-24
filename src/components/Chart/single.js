import React from "react";
import { ResponsiveLine } from "@nivo/line";

import { getCodeCitations } from "../Config";
import { useParams } from "react-router-dom";

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
  return nivoChart([{ id: codeName, data: citations }], title);
}

function nivoChart(data, title) {
  /**
   * Return nivo line-chart with default formatting for given data and title.
   */

  return (
    <div className="container">
      <h2 id="title">{title}</h2>
      <div className="chart">
        <ResponsiveLine
          title={title}
          data={data}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Year",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Citations (Google Scholar)",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          enableCrosshair={false}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
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
          ]}
          animate={false}
        />
      </div>
    </div>
  );
}

export { SingleChart, nivoChart };

/**
 * Column definition for table
 */
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import ABBREVIATIONS from "../data/abbreviations";
//idea: use search icon for link to google scholar
import ShowChartIcon from "@material-ui/icons/ShowChart";

import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SchoolIcon from "@material-ui/icons/School";
import LockOpenIcon from "@material-ui/icons/LockOpen";
//import NotInterestedIcon from '@material-ui/icons/NotInterested';
//import CopyrightIcon from '@material-ui/icons/Copyright';
import LockIcon from "@material-ui/icons/Lock";
import NoEncryptionIcon from "@material-ui/icons/NoEncryption";
// import { FlashOnOutlined } from "@material-ui/icons";

function TooltipText(tooltip, text) {
  /**
   * Nicesly styled tooltip.
   *
   * Cursor does not change shape.
   */
  return (
    <Tooltip title={tooltip} placement="top" key={tooltip} arrow>
      <span className="has-tooltip">{text}</span>
    </Tooltip>
  );
}

function TooltipTexts(values, tooltips) {
  /**
   * Multiple tooltips with zero-width breaking spaces in between to allow text wrapping.
   */
  if (values && values.length > 0) {
    return values
      .map((x) => TooltipText(tooltips[x], x))
      .reduce((prev, curr) => [prev, <wbr />, curr]);
  } else {
    return null;
  }
}

function getColumns(data, year) {
  /**
   * Prepare columns.
   *
   * Since 'customBodyRenderLite' function requires us to fetch the data ourselves, this getColumns function
   * relies on data to already be present (which is rather bad design).
   */
  let columns = [
    {
      name: "name",
      label: "Code",
      options: {
        filter: false,
        sort: true,
        // add homepage link to code
        customBodyRenderLite: (dataIndex) => {
          const row = data[dataIndex];
          return (
            <a href={row["homepage"]} target="_blank" rel="noreferrer">
              {row["name"]}
            </a>
          );
        },
      },
    },
    {
      name: "notes",
      label: "Notes",
      options: { filter: false, sort: true, display: false },
    },
    {
      name: "types",
      label: "Methods",
      options: {
        filter: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return TooltipTexts(
            data[dataIndex]["types"],
            ABBREVIATIONS["methods"]
          );
        },
      },
    },
    {
      name: "element_coverage",
      label: "Elements",
      options: { filter: false, sort: true, display: false },
    },
    {
      name: "tags",
      label: "Tags",
      options: {
        filter: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return TooltipTexts(data[dataIndex]["tags"], ABBREVIATIONS["tags"]);
        },
      },
    },
    {
      name: "distribution_channels",
      label: "Installation",
      options: {
        filter: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return TooltipTexts(
            data[dataIndex]["distribution_channels"],
            ABBREVIATIONS["distribution_channels"]
          );
        },
      },
    },
    {
      name: "acceleration",
      label: "Acceleration",
      options: {
        filter: true,
        sort: false,
        display: false,
        customBodyRenderLite: (dataIndex) => {
          return TooltipTexts(
            data[dataIndex]["acceleration"],
            ABBREVIATIONS["acceleration"]
          );
        },
      },
    },
    {
      name: "apis",
      label: "APIs",
      options: {
        filter: true,
        sort: true,
        display: false,
        customBodyRenderLite: (dataIndex) => {
          return TooltipTexts(data[dataIndex]["apis"], ABBREVIATIONS["apis"]);
        },
      },
    },
    {
      name: "benchmarks",
      label: "Benchmarks",
      options: {
        filter: true,
        sort: true,
        display: false,
        customBodyRenderLite: (dataIndex) => {
          const types = data[dataIndex]["benchmarks"];
          return types.map((x) => (
            <a
              href={"https://molmod.ugent.be/deltacodesdft"}
              target="_blank"
              rel="noreferrer"
            >
              {x}
            </a>
          ));
        },
      },
    },
    {
      name: "cost",
      label: "Cost",
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const x = data[dataIndex]["cost"];
          const cost = ABBREVIATIONS["cost"];
          if (["commercial"].includes(x)) {
            return TooltipText(cost[x], <AttachMoneyIcon />);
          } else if (["free (academia)"].includes(x)) {
            return TooltipText(
              cost[x],
              <span>
                <MoneyOffIcon />
                <SchoolIcon />
              </span>
            );
          } else {
            return TooltipText(cost[x], <MoneyOffIcon />);
          }
        },
      },
    },
    {
      name: "source",
      label: "Source",
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const x = data[dataIndex]["source"];
          const source = ABBREVIATIONS["source"];
          if (["available"].includes(x)) {
            return TooltipText(source[x], <LockOpenIcon color={"action"} />);
          } else if (["closed"].includes(x)) {
            return TooltipText(source[x], <LockIcon color={"action"} />);
          } else if (["copyleft", "permissive"].includes(x)) {
            const license = data[dataIndex]["license"];
            let text = "";
            if (license) {
              text = source[x] + " (" + license + ")";
            } else {
              text = source[x];
            }
            return TooltipText(text, <NoEncryptionIcon color={"action"} />);
          }
        },
      },
    },
    {
      name: "license",
      label: "License",
      options: {
        filter: false,
        sort: true,
        display: false,
        customBodyRenderLite: (dataIndex) => {
          const license = data[dataIndex]["license"];
          if (!license) {
            return null;
          }
          const type = data[dataIndex]["source"];
          if (["copyleft", "permissive"].includes(type)) {
            const spdxUrl = `https://spdx.org/licenses/${license}.html`;
            return (
              <a href={spdxUrl} target="_blank" rel="noreferrer">
                {license}
              </a>
            );
          } else {
            return license;
          }
        },
      },
    },
    {
      name: "citations",
      label: "Citations",
      options: {
        filter: false,
        sort: true,
        // add google scholar link to number of citations
        customBodyRenderLite: (dataIndex) => {
          const row = data[dataIndex];
          let searchUrl = "";

          if (row["query_method"] === "publication") {
            searchUrl =
              "https://scholar.google.com/scholar?cites=" +
              row["query_publication_id"].toString();
          } else {
            searchUrl =
              "https://scholar.google.com/scholar?q=" +
              encodeURIComponent(row["query_string"]);
          }
          searchUrl += "&hl=en&as_sdt=0%2C5&as_ylo=" + year + "&as_yhi=" + year;
          return (
            <a href={searchUrl} target="_blank" rel="noreferrer">
              {row["citations"]}
            </a>
          );
        },
      },
    },
    {
      name: "trend",
      label: "Trend",
      options: {
        filter: false,
        sort: false,
        // add google scholar link to number of citations
        customBodyRenderLite: (dataIndex) => {
          const row = data[dataIndex];
          return (
            <Button
              href={"#/charts/" + encodeURIComponent(row["name"])}
              color="secondary"
            >
              <ShowChartIcon />{" "}
            </Button>
          );
        },
      },
    },
  ];

  return columns;
}

export { getColumns };

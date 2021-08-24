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
import ContactMailIcon from "@material-ui/icons/ContactMail";
//import CopyrightIcon from '@material-ui/icons/Copyright';
import LockIcon from "@material-ui/icons/Lock";
import NoEncryptionIcon from "@material-ui/icons/NoEncryption";

function TooltipText(tooltip, text) {
  /**
   * Tooltip with nicely spaced text that doesn't become a cursor.
   */
  return (
    <Tooltip title={tooltip} placement="top" key={tooltip} arrow >
      <span className="has-tooltip">{text}</span>
    </Tooltip>
  );
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
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const types = data[dataIndex]["types"];
          return types.map((x) => TooltipText(ABBREVIATIONS["methods"][x], x));
        },
      },
    },
    {
      name: "element_coverage",
      label: "Element coverage",
      options: { filter: false, sort: true, display: false },
    },
    {
      name: "acceleration",
      label: "Acceleration",
      options: { filter: true, sort: true, display: false,
        customBodyRenderLite: (dataIndex) => {
          const types = data[dataIndex]["acceleration"];
          if (!types) { return ""; } else {
          return types.map((x) => TooltipText(ABBREVIATIONS["acceleration"][x], x)); 
        }
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
          const types = data[dataIndex]["apis"];
          return types.map((x) => TooltipText(ABBREVIATIONS["apis"][x], x));
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
          return types.map((x) => <a href={'https://molmod.ugent.be/deltacodesdft'} target="_blank" rel="noreferrer">{x}</a>);
        },
      },

    },
    {
      name: "tags",
      label: "Tags",
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const types = data[dataIndex]["tags"];
          return types.map((x) => TooltipText(ABBREVIATIONS["tags"][x], x));
        },
      },
    },
    {
      name: "license",
      label: "Cost",
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const x = data[dataIndex]["license"];
          const licenses = ABBREVIATIONS["licenses"];
          if (["C(S)", "C(C)"].includes(x)) {
            return TooltipText(licenses[x], <AttachMoneyIcon />);
          } else if (["F(A)"].includes(x)) {
            return TooltipText(
              licenses[x],
              <span>
                <MoneyOffIcon />
                <SchoolIcon />
              </span>
            );
          } else if (["I"].includes(x)) {
            return TooltipText(licenses[x], <ContactMailIcon />);
          } else {
            return TooltipText(licenses[x], <MoneyOffIcon />);
          }
          //return TooltipText(licenses[x], x);  import ContactMailIcon from '@material-ui/icons/ContactMail';
        },
      },
    },
    {
      name: "license",
      label: "Source",
      options: {
        filter: false,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const x = data[dataIndex]["license"];
          const licenses = ABBREVIATIONS["licenses"];
          if (["C(S)", "F(A)"].includes(x)) {
            return TooltipText(licenses[x], <LockOpenIcon color={"action"} />);
          } else if (["C(C)"].includes(x)) {
            return TooltipText(licenses[x], <LockIcon color={"action"} />);
          } else if (["OS(P)", "OS(CL)"].includes(x)) {
            return TooltipText(
              licenses[x],
              <NoEncryptionIcon color={"action"} />
            );
          } else if (["F"].includes(x)) {
            return TooltipText(
              licenses[x],
              <span>
                <NoEncryptionIcon color={"action"} />
              </span>
            );
          } else {
            return TooltipText(licenses[x], x);
          }
        },
      },
    },
    {
      name: "license_annotation",
      label: "License Note",
      options: { filter: false, sort: true, display: false },
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
        sort: true,
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

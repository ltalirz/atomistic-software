import citations from "../data/citations.json";
import codes from "../data/codes.json";

// Citation cutoff per year (~1 citation per week)
const CUTOFF = 50;

function yearToRange(year) {
  /**
   * Transform year to year range used in citations.json
   *
   * E.g. 2020 => "2020-2020"
   */
  return year.toString() + "-" + year.toString();
}

function rangeToYear(range) {
  /**
   * Transform year range used in citations.json to year
   *
   * E.g. "2020-2020" => 2020
   */
  return parseInt(range.split("-")[0]);
}

// For whatever reason, one cannot simply use `citations.keys()`
let YEARS = [];
for (const citation in citations) {
  YEARS.push(rangeToYear(citation));
}
YEARS = [...new Set(YEARS)];
YEARS.sort();

let CODES = [];
for (const codename in codes) {
  CODES.push(codename);
}

function getData(year) {
  /**
   * Get data for code table for a given year.
   */
  let range_key = yearToRange(year);
  let citations_data = citations[range_key]["citations"];
  let data = codes; //.slice();

  for (const codename in data) {
    data[codename]["citations"] = citations_data[codename]["citations"];
    data[codename]["datestamp"] = citations_data[codename]["datestamp"];
  }

  let dataArray = [];
  for (const codename in data) {
    dataArray.push(Object.assign({}, data[codename]));
  }
  return dataArray;
}

function getDataChart() {
  /**
   * Get citation data for all codes
   */
  let lines = [];
  for (const codeName of CODES.slice(0, 50)) {
    lines.push({ id: codeName, data: getCiteYears(codeName) });
  }
  return lines;
}

function filterCodeNames(filters) {
  /**
   * Return list of code names after applying filters.
   *
   * E.g. filters = {'type': ['DFT']}
   */
  let codeNames = [];
  for (const codeName in codes) {
    for (const filter in filters) {
      if (filters[filter].includes(codes[codeName][filter])) {
        codeNames.push(codeName);
      }
    }
  }
  return codeNames;
}

function getCiteYears(codeName) {
  /**
   * Return citations of requested code vs years.
   */
  let line_data = [];
  for (const year of YEARS) {
    let data = {};
    let range_key = yearToRange(year);

    data["x"] = parseInt(year);
    data["y"] = parseInt(
      citations[range_key]["citations"][codeName]["citations"]
    );
    if (isNaN(data["y"]) || data["y"] <= 0) {
      data["y"] = 0;
    }
    line_data.push(data);
  }
  return line_data;
}

function getCodeCitations(codeNames) {
  /**
   * Return data with citations for all code names.
   *
   * Each item has:
   *  {id: name, data: [{x: year1, y: cites1}, {x: year2, y: cites2}, ...]}
   */
  const result = [];
  
  if (!codeNames || !Array.isArray(codeNames) || codeNames.length === 0) {
    console.warn("getCodeCitations: No code names provided");
    return result;
  }
  
  // Log which codes we're fetching citations for
  console.log("Fetching citations for codes:", codeNames);
  
  for (const name of codeNames) {
    try {
      const citationData = getCiteYears(name);
      if (citationData && citationData.length > 0) {
        result.push({
          id: name,
          data: citationData
        });
      } else {
        console.warn(`No citation data found for ${name}`);
      }
    } catch (error) {
      console.error(`Error getting citations for ${name}:`, error);
    }
  }
  
  // Debug the final result
  console.log("Citation data result:", result);
  
  return result;
}

export {
  yearToRange,
  rangeToYear,
  YEARS,
  CODES,
  getData,
  getDataChart,
  filterCodeNames,
  getCodeCitations,
  CUTOFF,
};

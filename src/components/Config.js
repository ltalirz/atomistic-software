import citations from "../data/citations.json";
import codes from "../data/codes.json";

// Citation cutoff per year (~1 citation per week)
const CUTOFF = 50;

/**
 * Get code metadata resolved for a specific year.
 *
 * Applies updates from the 'updates' field in codes.json to get
 * the correct metadata at the beginning of the specified year.
 *
 * Example: if code has updates: { "2020": { "license": "GPL", "source": "copyleft" } }
 * then getCodeMetadataForYear("code", 2019) returns original metadata,
 * while getCodeMetadataForYear("code", 2020) returns metadata with GPL license.
 *
 * @param {string} codeName - Name of the code
 * @param {number} year - Year to get metadata for
 * @returns {Object} Code metadata resolved for the given year
 */
function resolveCodeMetadataForYear(codeName, year) {
  const code = codes[codeName];
  if (!code) return null;

  // Start with a shallow copy of the base metadata
  const resolved = { ...code };

  // If no updates, return base metadata
  if (!code.updates) return resolved;

  // Apply updates for all years up to and including the target year
  const updateYears = Object.keys(code.updates)
    .map((y) => parseInt(y, 10))
    .filter((y) => y <= year)
    .sort((a, b) => a - b);

  for (const updateYear of updateYears) {
    const yearUpdates = code.updates[updateYear.toString()];
    Object.assign(resolved, yearUpdates);
  }

  // Don't include the updates field in the resolved output
  delete resolved.updates;

  return resolved;
}

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

/**
 * Pre-built cache of resolved code metadata for each year.
 *
 * Structure: { year: { codeName: resolvedMetadata, ... }, ... }
 *
 * This is computed once at module load time for O(1) lookups,
 * avoiding repeated resolution during graph rendering.
 */
const CODES_BY_YEAR = {};
for (const year of YEARS) {
  CODES_BY_YEAR[year] = {};
  for (const codeName of CODES) {
    CODES_BY_YEAR[year][codeName] = resolveCodeMetadataForYear(codeName, year);
  }
}

/**
 * Get pre-computed code metadata for a specific year.
 * O(1) lookup from the pre-built cache.
 *
 * @param {string} codeName - Name of the code
 * @param {number} year - Year to get metadata for
 * @returns {Object} Code metadata resolved for the given year
 */
function getCodeMetadataForYear(codeName, year) {
  return CODES_BY_YEAR[year]?.[codeName] || null;
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

function filterCodeNamesForYear(filters, year) {
  /**
   * Return list of code names after applying filters, using year-resolved metadata.
   *
   * This is the time-aware version of filterCodeNames that accounts for
   * license/source/cost changes over time.
   *
   * E.g. filters = {'source': ['copyleft', 'permissive']}, year = 2015
   */
  let codeNames = [];
  for (const codeName in codes) {
    const codeMetadata = getCodeMetadataForYear(codeName, year);
    for (const filter in filters) {
      if (filters[filter].includes(codeMetadata[filter])) {
        codeNames.push(codeName);
        break; // Only add once if any filter matches
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

  // Debug: which codes are being processed (disabled in production)
  // console.debug("Fetching citations for codes:", codeNames);

  for (const name of codeNames) {
    try {
      const citationData = getCiteYears(name);
      if (citationData && citationData.length > 0) {
        result.push({
          id: name,
          data: citationData,
        });
      } else {
        console.warn(`No citation data found for ${name}`);
      }
    } catch (error) {
      console.error(`Error getting citations for ${name}:`, error);
    }
  }

  // Debug: final citation data result (disabled in production)
  // console.debug("Citation data result:", result);

  return result;
}

export {
  yearToRange,
  rangeToYear,
  YEARS,
  CODES,
  CODES_BY_YEAR,
  getData,
  getDataChart,
  filterCodeNames,
  filterCodeNamesForYear,
  getCodeMetadataForYear,
  getCodeCitations,
  CUTOFF,
};

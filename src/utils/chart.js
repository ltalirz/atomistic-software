// Shared chart-related utilities

// Minimum Y value shown when using log scale
export const LOG_Y_MIN = 50;

/**
 * Aggregate multiple series by summing Y values per year.
 * @param {Array<{data: Array<{x:number|string, y:number}>}>} seriesList
 * @param {number[]} years - list of known years to initialize the axis
 * @returns {Array<{x:number, y:number}>}
 */
export function aggregateSeries(seriesList, years = []) {
  const sums = new Map();
  years.forEach((yr) => sums.set(yr, 0));
  (seriesList || []).forEach((series) => {
    (series?.data || []).forEach((pt) => {
      const yr = typeof pt.x === "string" ? parseInt(pt.x, 10) : pt.x;
      const y = typeof pt.y === "number" ? pt.y : 0;
      if (!Number.isNaN(yr)) {
        sums.set(yr, (sums.get(yr) || 0) + y);
      }
    });
  });
  return Array.from(sums.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([x, y]) => ({ x, y }));
}

/**
 * Aggregate citations by year using time-aware filtering.
 *
 * For each year, determines which codes match the filter for that specific year
 * (accounting for license/source/cost changes over time), then sums their citations.
 *
 * Uses the pre-built CODES_BY_YEAR cache for O(1) lookups per code/year.
 *
 * @param {Object} codesByYear - Pre-built cache: { year: { codeName: metadata, ... }, ... }
 * @param {Object} citations - The citations data object
 * @param {Object} filters - Filter criteria, e.g., { source: ['copyleft', 'permissive'] }
 * @param {number[]} years - List of years to aggregate over
 * @param {Function} yearToRange - Function to convert year to citation range key
 * @returns {Array<{x:number, y:number}>}
 */
export function aggregateSeriesTimeAware(
  codesByYear,
  citations,
  filters,
  years,
  yearToRange
) {
  const result = [];

  for (const year of years) {
    let sum = 0;
    const codesForYear = codesByYear[year];
    if (!codesForYear) continue;

    // For each year, find codes matching the filter for that specific year
    for (const codeName in codesForYear) {
      const codeMetadata = codesForYear[codeName];

      // Check if this code matches any filter for this year
      let matches = false;
      for (const filterKey in filters) {
        const filterValues = filters[filterKey];
        if (filterValues.includes(codeMetadata[filterKey])) {
          matches = true;
          break;
        }
      }

      if (matches) {
        // Add this code's citations for this year
        const rangeKey = yearToRange(year);
        const citationData = citations[rangeKey]?.citations?.[codeName];
        if (citationData && typeof citationData.citations === "number") {
          sum += citationData.citations;
        }
      }
    }

    result.push({ x: year, y: sum });
  }

  return result;
}

/**
 * Normalize raw citations data for log-scale display by:
 * - ensuring items have id and data array
 * - filtering out points with non-positive or invalid values
 */
export function normalizeCitationsForLogScale(citationsData = []) {
  if (!Array.isArray(citationsData)) return [];
  return citationsData
    .map((item) => {
      if (!item || !item.id || !Array.isArray(item.data)) {
        return null;
      }
      const validData = item.data.filter(
        (point) =>
          point &&
          typeof point.x !== "undefined" &&
          typeof point.y === "number" &&
          point.y > 0
      );
      if (validData.length > 0) {
        return { id: item.id, data: validData };
      }
      return null;
    })
    .filter(Boolean);
}

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
      const yr = typeof pt.x === 'string' ? parseInt(pt.x, 10) : pt.x;
      const y = typeof pt.y === 'number' ? pt.y : 0;
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
          typeof point.x !== 'undefined' &&
          typeof point.y === 'number' &&
          point.y > 0
      );
      if (validData.length > 0) {
        return { id: item.id, data: validData };
      }
      return null;
    })
    .filter(Boolean);
}

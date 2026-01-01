// Utilities for selection maps and code filtering

/**
 * Return keys with truthy value from a selection map { key: boolean }.
 */
export function getSelectedKeys(selectionMap = {}) {
  return Object.keys(selectionMap).filter((k) => !!selectionMap[k]);
}

/**
 * Build a new selection map from a list of items, setting all to the given value.
 */
export function bulkSelect(items = [], value = false) {
  const out = {};
  items.forEach((item) => {
    out[item] = value;
  });
  return out;
}

/**
 * Immutable toggle helper for selection maps.
 */
export function updateToggle(prev = {}, name, checked) {
  return { ...prev, [name]: checked };
}

/**
 * Filter code names using selected types, costs, and sources arrays.
 * Matches codes that satisfy the filter in ANY year (to account for
 * license/cost changes over time).
 *
 * @param {Object} codesByYear - CODES_BY_YEAR cache for time-aware filtering
 * @param {Object} options - Filter options
 * @param {string[]} options.types - Types to include
 * @param {string[]} options.costs - Costs to include
 * @param {string[]} options.sources - Sources to include
 * @returns {string[]} - Array of matching code names
 */
export function filterCodesBySelections(
  codesByYear,
  { types = [], costs = [], sources = [] } = {}
) {
  const typeMatch = (code) =>
    types.length === 0 ||
    (code.types && code.types.some((t) => types.includes(t)));
  const costMatch = (code) =>
    costs.length === 0 || (code.cost && costs.includes(code.cost));
  const sourceMatch = (code) =>
    sources.length === 0 || (code.source && sources.includes(code.source));

  // Collect all unique code names from any year
  const allCodeNames = new Set();
  for (const year in codesByYear) {
    for (const codeName in codesByYear[year]) {
      allCodeNames.add(codeName);
    }
  }

  return Array.from(allCodeNames).filter((codeName) => {
    // Check if the code matches in ANY year
    for (const year in codesByYear) {
      const codeForYear = codesByYear[year][codeName];
      if (codeForYear) {
        if (
          typeMatch(codeForYear) &&
          costMatch(codeForYear) &&
          sourceMatch(codeForYear)
        ) {
          return true;
        }
      }
    }
    return false;
  });
}

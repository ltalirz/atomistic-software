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
 * Filter code names from codesData using selected types, costs, and sources arrays.
 */
export function filterCodesBySelections(codesData = {}, { types = [], costs = [], sources = [] } = {}) {
  const typeMatch = (code) =>
    types.length === 0 || (code.types && code.types.some((t) => types.includes(t)));
  const costMatch = (code) => costs.length === 0 || (code.cost && costs.includes(code.cost));
  const sourceMatch = (code) => sources.length === 0 || (code.source && sources.includes(code.source));

  return Object.keys(codesData).filter((codeName) => {
    const code = codesData[codeName];
    return typeMatch(code) && costMatch(code) && sourceMatch(code);
  });
}

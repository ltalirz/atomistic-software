// Utility to build Google Scholar URLs for a given code metadata object and year

/**
 * Build a Google Scholar URL for a given code metadata and year.
 * The metadata object should contain query_method, query_publication_id, and/or query_string.
 * Returns null if insufficient data.
 */
export function buildScholarUrl(meta, year) {
  if (!meta || typeof year === "undefined" || year === null) return null;

  let searchUrl = "";
  if (meta["query_method"] === "publication" && meta["query_publication_id"]) {
    searchUrl =
      "https://scholar.google.com/scholar?cites=" +
      String(meta["query_publication_id"]);
  } else if (meta["query_string"]) {
    searchUrl =
      "https://scholar.google.com/scholar?q=" +
      encodeURIComponent(meta["query_string"]);
  } else {
    return null;
  }

  // Restrict to the given year
  searchUrl += `&hl=en&as_vis=1&as_sdt=0%2C5&as_ylo=${year}&as_yhi=${year}`;
  return searchUrl;
}

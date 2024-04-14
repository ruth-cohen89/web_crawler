const { URL } = require("url");

/**
 * Checks if two URLs belong to the same domain.
 * @param {string} entryUrl - The entry point URL.
 * @param {string} url - The URL to compare with the entry URL.
 * @returns {boolean} - Returns true if both URLs belong to the same domain, otherwise false.
 */
function isSameDomain(entryUrl, url) {
  try {
    const entryDomain = new URL(entryUrl).hostname;
    const urlDomain = new URL(url).hostname;
    return entryDomain === urlDomain;
  } catch (error) {
    console.error("Error comparing domains:", error.message);
    return false;
  }
}

/**
 * The normalizeURL function ensures that URLs leading to the same page produce the same output.
 * For example: 'http://www.boot.dev', 'http://www.BooT.dev', 'https://www.boot.dev' will all normalize to 'www.boot.dev'.
 * @param {string} urlString - The URL to normalize.
 * @returns {string} - The normalized URL.
 */
function normalizeURL(urlString) {
  try {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
      return hostPath.slice(0, -1);
    }
    return hostPath;
  } catch (error) {
    console.error("Error normalizing URL:", error.message);
    return urlString;
  }
}

module.exports = { isSameDomain, normalizeURL };

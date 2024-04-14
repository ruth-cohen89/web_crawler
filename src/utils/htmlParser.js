const { URL } = require("url");
const cheerio = require("cheerio");

/**
 * Parses the HTML content and extracts absolute URLs from anchor tags' href attributes.
 * @param {string} htmlContent - The HTML content of the webpage.
 * @param {string} baseUrl - The base URL of the webpage.
 * @returns {Array<string>} - An array of absolute URLs extracted from the HTML content.
 */
function getUrls(htmlContent, baseUrl) {
  const urls = [];

  try {
    const $ = cheerio.load(htmlContent);
    $("a[href]").each((index, element) => {
      const href = $(element).attr("href");

      try {
        // Attempt to construct absolute URL
        const absoluteUrl = new URL(href, baseUrl).href;
        urls.push(absoluteUrl);
      } catch (urlError) {
        // Handle URL parsing errors
        console.error(`Error parsing URL: ${href}`, urlError.message);
      }
    });
  } catch (cheerioError) {
    // Handle Cheerio parsing errors
    console.error("Error parsing HTML content:", cheerioError.message);
  }

  return urls;
}
module.exports = { getUrls };

const { URL } = require("url");
const cheerio = require("cheerio");

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

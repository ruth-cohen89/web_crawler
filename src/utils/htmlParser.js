const { URL } = require("url");
const cheerio = require("cheerio");

function getUrls(htmlContent, baseUrl) {
  const $ = cheerio.load(htmlContent);
  const urls = [];
  $("a[href]").each((index, element) => {
    const absoluteUrl = new URL($(element).attr("href"), baseUrl).href;
    urls.push(absoluteUrl);
  });
  return urls;
}

module.exports = { getUrls };

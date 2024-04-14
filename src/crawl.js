const axios = require("axios");
const { writeFile, getFileName } = require("./fileHandler");
const { isSameDomain, normalizeURL } = require("./utils/urlUtils");
const { getUrls } = require("./utils/htmlParser");

async function crawlWebsite(entryUrl, folderPath) {
  const visitedUrls = new Set();
  const pagesDownloaded = new Set();
  const queue = [{ url: entryUrl, parentUrl: "" }];

  while (queue.length > 0) {
    const { url, parentUrl } = queue.shift();

    // Normalize the URL to avoid duplicates
    const normalizedUrl = normalizeURL(url);

    // Skip if already visited
    if (visitedUrls.has(normalizedUrl)) {
      continue;
    }

    try {
      const response = await axios.get(url);

      if (response.status !== 200) {
        continue;
      }

      const filename = getFileName(url);
      const filePath = `${folderPath}/${filename}`;

      writeFile(filePath, response.data);

      // Add the URL to the set of downloaded pages
      pagesDownloaded.add(url);

      // Extract URLs from the response content and add them to the queue
      const urls = getUrls(response.data, url);
      urls.forEach((absoluteUrl) => {
        // Normalize each URL before adding to the queue
        const normalizedAbsoluteUrl = normalizeURL(absoluteUrl);

        // Avoid adding duplicates and URLs from external domains
        if (
          !visitedUrls.has(normalizedAbsoluteUrl) &&
          isSameDomain(entryUrl, absoluteUrl)
        ) {
          queue.push({ url: absoluteUrl, parentUrl: url });
        }
      });
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
    }

    // Add the normalized URL to the visited set
    visitedUrls.add(normalizedUrl);
  }

  return pagesDownloaded;
}

module.exports = { crawlWebsite };

const axios = require("axios");
const { writeFile, getFileName, getDomainName } = require("./fileHandler");
const { isSameDomain, normalizeURL } = require("./utils/urlUtils");
const { getUrls } = require("./utils/htmlParser");

// Define an object to store crawled URLs for each domain
const domainCache = {};

async function crawlWebsite(entryUrl, folderPath) {
  const visitedUrls = new Set();
  const pagesDownloaded = new Set();
  const queue = [{ url: entryUrl, parentUrl: "" }];
  console.log("welcome", domainCache);
  while (queue.length > 0) {
    const { url, parentUrl } = queue.shift();

    // Normalize the URL to avoid duplicates
    const normalizedUrl = normalizeURL(url);
    const domain = getDomainName(url);

    // Initialize domain cache if not exists
    if (!domainCache[domain]) {
      domainCache[domain] = new Set();
    }

    // Skip if URL is already crawled for this domain
    if (domainCache[domain].has(url)) {
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

      // Cache the URL for this domain
      domainCache[domain].add(url);
      console.log("cache", domainCache);
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
    }

    // Add the normalized URL to the visited set
    visitedUrls.add(normalizedUrl);
  }

  return pagesDownloaded;
}

module.exports = { crawlWebsite };

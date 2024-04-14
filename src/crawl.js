const axios = require("axios");
const { writeFile, getFileName, getDomainName } = require("./fileHandler");
const { isSameDomain, normalizeURL } = require("./utils/urlUtils");
const { getUrls } = require("./utils/htmlParser");

/**
 * Cache to store visited URLs for each domain.
 */
const domainCache = {};

/**
 * Crawls the website starting from the entry URL and downloads all pages into the designated local folder.
 * @param {string} entryUrl - The entry point URL of the website.
 * @param {string} folderPath - The local folder path where pages will be stored.
 * @returns {Set} - A Set containing the URLs of all downloaded pages.
 */
async function crawlWebsite(
  entryUrl,
  folderPath,
  downloadConcurrent,
  maxPages
) {
  const visitedUrls = new Set();
  const pagesDownloaded = new Set();
  const queue = [{ url: entryUrl, parentUrl: "" }];

  // Main crawling loop
  while (queue.length > 0 && pagesDownloaded.size < maxPages) {
    if (
      maxPages - pagesDownloaded.size < 10 &&
      maxPages - pagesDownloaded.size > 0
    ) {
      downloadConcurrent = maxPages - pagesDownloaded.size;
      console.log("downloadConcurrent", downloadConcurrent);
    }

    await Promise.all(
      queue
        .splice(0, downloadConcurrent)
        .map(({ url }) =>
          fetchUrlAndUpdate(
            url,
            visitedUrls,
            pagesDownloaded,
            queue,
            folderPath,
            entryUrl
          )
        )
    );
  }

  return pagesDownloaded;
}

async function fetchUrlAndUpdate(
  url,
  visitedUrls,
  pagesDownloaded,
  queue,
  folderPath,
  entryUrl
) {
  // Normalize the URL to avoid duplicates
  const normalizedUrl = normalizeURL(url);
  const domain = getDomainName(url);

  // Initialize the domain cache to store visited URLs for each domain
  if (!domainCache[domain]) {
    domainCache[domain] = new Set();
  }

  // Skip crawling if URL is already visited for this domain
  if (domainCache[domain].has(url)) {
    return;
  }

  try {
    // Fetch the webpage content
    const response = await axios.get(url);

    // Check if the response is successful
    if (response.status !== 200) {
      return;
    }

    // Generate filename and file path for saving the webpage
    const filename = getFileName(url);
    const filePath = `${folderPath}/${filename}`;

    // Write the webpage content to a file
    writeFile(filePath, response.data);

    // Add the URL to the set of downloaded pages
    pagesDownloaded.add(url);

    // Extract URLs from the response content and add them to the queue
    const urls = getUrls(response.data, url);
    urls.forEach((absoluteUrl) => {
      // Normalize each URL before adding to the queue
      const normalizedAbsoluteUrl = normalizeURL(absoluteUrl);

      // Avoid adding duplicates and URLs from external domains to the queue
      if (
        !visitedUrls.has(normalizedAbsoluteUrl) &&
        isSameDomain(entryUrl, absoluteUrl)
      ) {
        queue.push({ url: absoluteUrl, parentUrl: url });
      }
    });

    // Cache the URL for this domain
    domainCache[domain].add(url);
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
  }

  // Add the normalized URL to the visited set
  visitedUrls.add(normalizedUrl);
}

module.exports = { crawlWebsite };

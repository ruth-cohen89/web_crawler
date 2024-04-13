const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { URL } = require("url");

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
      fs.writeFileSync(`${folderPath}/${filename}`, response.data);
      pagesDownloaded.add(url);

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

function getFileName(url) {
  // Extract hostname and path portions of the URL
  let { hostname, pathname } = new URL(url);

  // Remove "www." and ".com" from the hostname
  hostname = hostname.replace(/^www\./, "").replace(/\.com$/, "");

  if (pathname === "/") {
    pathname = ""; // Set it to empty to avoid including it in the filename
    return hostname + ".html";
  }

  // Remove leading and trailing slashes from the pathname
  pathname = pathname.replace(/[^a-zA-Z0-9-_.]/g, "_");

  // Combine cleaned hostname and path to form the filename
  let filename = hostname + pathname;

  // Add .html extension
  return filename + ".html";
}

// the job of normalizeURL function is to take in the input urls and then return
// same output for the URLs that lead to the same page
// example: 'http://www.boot.dev', 'http://www.BooT.dev', 'https://www.boot.dev'
function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

function getUrls(htmlContent, baseUrl) {
  const $ = cheerio.load(htmlContent);
  const urls = [];
  $("a[href]").each((index, element) => {
    const absoluteUrl = new URL($(element).attr("href"), baseUrl).href;
    urls.push(absoluteUrl);
  });
  return urls;
}

function isSameDomain(entryUrl, url) {
  const entryDomain = new URL(entryUrl).hostname;
  const urlDomain = new URL(url).hostname;
  return entryDomain === urlDomain;
}

// Example usage:
function createLocalFolder(url) {
  const hostname = getDomainName(url);

  if (!fs.existsSync(`websites/${hostname}`)) {
    fs.mkdirSync(`websites/${hostname}`);
    console.log("folder created");
  }
  return `websites/${hostname}`;
}

function getDomainName(url) {
  // Parse the URL to get the hostname
  const { hostname } = new URL(url);

  // Split the hostname by periods (.)
  const parts = hostname.split(".");

  // Remove the first part if it's 'www'
  if (parts[0] === "www") {
    parts.shift();
  }

  // Extract the first part as the domain name
  const domain = parts[0];
  return domain;
}
const entryPoint = "https://www.larstornoe.com";
const folderPath = createLocalFolder(entryPoint);

crawlWebsite(entryPoint, folderPath)
  .then((pagesDownloaded) =>
    console.log(`Pages downloaded: ${Array.from(pagesDownloaded).join(", ")}`)
  )
  .catch((error) => console.error(`Error: ${error.message}`));

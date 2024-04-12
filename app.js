const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { URL } = require("url");
const { uploadFileToS3, getFileFromS3 } = require("./utils/s3_service");

async function crawlWebsite(entryUrl, folderPath) {
  let i = 1;
  const visitedUrls = new Set();
  const pagesDownloaded = new Set();
  const queue = [{ url: entryUrl, parentUrl: "" }]; // { url, parentUrl }

  while (queue.length > 0) {
    const { url, parentUrl } = queue.shift();

    //Skip if already visited
    if (visitedUrls.has(url)) {
      continue;
    }

    try {
      const response = await axios.get(url);

      if (response.status !== 200) {
        continue;
      }

      // todo: check it and delete the log
      const contentType = response.headers["content-type"];
      if (!contentType.includes("text/html")) {
        console.log(
          "Non-HTML response, content type:",
          contentType,
          "on page:",
          currentUrl
        );
        // Instead of directly returning, you might want to handle the error accordingly.
        // For now, let's assume you want to continue crawling even after an error.
        continue;
      }

      const filename = getFileName(url);
      console.log(filename);
      fs.writeFileSync(`${folderPath}/${filename}`, response.data);
      pagesDownloaded.add(url); // add data!

      const urls = getUrls(response.data, url);

      urls.forEach((absoluteUrl) => {
        // Avoid adding duplicates and URLs from external domains
        if (
          !visitedUrls.has(absoluteUrl) &&
          isSameDomain(entryUrl, absoluteUrl)
        ) {
          queue.push({ url: absoluteUrl, parentUrl: url });
        }
      });
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
    }

    visitedUrls.add(url);
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

function getUrls(htmlContent, baseUrl) {
  const $ = cheerio.load(htmlContent);
  const urls = [];
  $("a[href]").each((index, element) => {
    const absoluteUrl = new URL($(element).attr("href"), baseUrl).href;
    const normalizedUrl = normalizeURL(absoluteUrl); // Normalize the URL
    urls.push(normalizedUrl);
  });
  return urls;
}

// the job of normalizeURL function is to take in the input urls and then return
// same output for the URLs that lead to the same page
// example: 'http://www.boot.dev', 'http://www.BooT.dev', 'https://www.boot.dev' -> Although these three might look different
// All these URLs obviously lead to the same page. So, we want the normalizeURL function to return same output URL
// for all these URLs, like 'boot.dev'
function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

function isSameDomain(entryUrl, url) {
  const entryDomain = new URL(entryUrl).hostname;
  const urlDomain = new URL(url).hostname;
  return entryDomain === urlDomain;
}

// Example usage:
// todo: delete after:
// if (!fs.existsSync("./dev_files/larstornoe")) {
//   fs.mkdirSync("./dev_files/larstornoe");
// }
// crawlWebsite("https://www.larstornoe.com", "larstornoe")
//   .then((pagesDownloaded) =>
//     console.log(`Pages downloaded: ${Array.from(pagesDownloaded).join(", ")}`)
//   )
//   .catch((error) => console.error(`Error: ${error.message}`));

// getFileFromS3(
//   "file.txt",
//   "C:/Users/Ruth.LAPTOP-6SFCFEG0/Desktop/webcrawler/file.txt"
// );
// uploadFileToS3(
//   "file.txt",
//   "C:/Users/Ruth.LAPTOP-6SFCFEG0/Desktop/webcrawler/utils/file.txt"
// );

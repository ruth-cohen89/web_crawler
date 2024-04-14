const { crawlWebsite } = require("./src/crawl");
const { createLocalFolder } = require("./src/fileHandler");

const entryPoint = "https://www.larstornoe.com";
//const entryPoint = "https://youtube.com";
const folderPath = createLocalFolder(entryPoint);

// Number of concurrent downloads
const downloadConcurrent = 10;

// Maximum number of pages to download from a website
// Limits big websites with a lot of pages (like youtube.com)
const maxPages = 100;

/**
 * Initiating the crawling process.
 */
async function main() {
  try {
    const pagesDownloaded = await crawlWebsite(
      entryPoint,
      folderPath,
      downloadConcurrent,
      maxPages
    );
    console.log(
      `${pagesDownloaded.size} Pages downloaded: ${Array.from(
        pagesDownloaded
      ).join(", ")}`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();

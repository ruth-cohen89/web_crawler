// index.js
const { crawlWebsite } = require("./src/crawl");
const { createLocalFolder } = require("./src/fileHandler");

// const entryPoint = "https://www.larstornoe.com";
const entryPoint = "https://youtube.com";
const folderPath = createLocalFolder(entryPoint);
const downloadConcurrent = 10;

// Maximum pages to download from a website
// Limits big websites with a lot of pages (like instagram)
// If more resources are added (more servers) this limit can be adjusted
const maxPages = 100;

async function main() {
  try {
    const pagesDownloaded = await crawlWebsite(
      entryPoint,
      folderPath,
      downloadConcurrent,
      maxPages
    );
    console.log(`Pages downloaded: ${Array.from(pagesDownloaded).join(", ")}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();

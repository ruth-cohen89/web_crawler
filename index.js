// index.js
const { crawlWebsite } = require("./src/crawl");
const { createLocalFolder } = require("./src/fileHandler");

// const entryPoint = "https://www.larstornoe.com";
const entryPoint = "https://www.example.com";
const folderPath = createLocalFolder(entryPoint);

crawlWebsite(entryPoint, folderPath)
  .then((pagesDownloaded) =>
    console.log(`Pages downloaded: ${Array.from(pagesDownloaded).join(", ")}`)
  )
  .catch((error) => console.error(`Error: ${error.message}`));

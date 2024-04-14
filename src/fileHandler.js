const fs = require("fs");

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

function createLocalFolder(url) {
  try {
    const hostname = getDomainName(url);

    if (!fs.existsSync(`./websites/${hostname}`)) {
      fs.mkdirSync(`./websites/${hostname}`, { recursive: true });
      console.log("folder created");
    }
    return `websites/${hostname}`;
  } catch (error) {
    console.error("Error creating local folder:", error.message);
    throw error;
  }
}

function getFileName(url) {
  try {
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
  } catch (error) {
    console.error("Error getting file name:", error.message);
    throw error;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error.message);
    throw error;
  }
}

module.exports = { createLocalFolder, getFileName, writeFile, getDomainName };

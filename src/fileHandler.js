const fs = require("fs");

/**
 * Retrieves the domain name from the given URL.
 * @param {string} url - The URL from which to extract the domain name.
 * @returns {string} - The domain name extracted from the URL.
 */
function getDomainName(url) {
  const { hostname } = new URL(url);
  const parts = hostname.split(".");

  if (parts[0] === "www") {
    parts.shift();
  }

  // Extract the first part as the domain name
  const domain = parts[0];
  return domain;
}

/**
 * Creates a local folder based on the domain name extracted from the URL.
 * @param {string} url - The URL used to extract the domain name for folder creation.
 * @returns {string} - The path of the created local folder.
 * @throws {Error} - Throws an error if folder creation fails.
 */
function createLocalFolder(url) {
  try {
    const hostname = getDomainName(url);

    if (!fs.existsSync(`./websites/${hostname}`)) {
      fs.mkdirSync(`./websites/${hostname}`, { recursive: true });
    }
    return `websites/${hostname}`;
  } catch (error) {
    console.error("Error creating local folder:", error.message);
    throw error;
  }
}

/**
 * Generates a filename based on the URL.
 * @param {string} url - The URL used to generate the filename.
 * @returns {string} - The generated filename.
 * @throws {Error} - Throws an error if filename generation fails.
 */
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

/**
 * Writes content to a file at the specified file path.
 * @param {string} filePath - The path to the file where content will be written.
 * @param {string} content - The content to write to the file.
 * @throws {Error} - Throws an error if file writing fails.
 */
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error.message);
    throw error;
  }
}

module.exports = { createLocalFolder, getFileName, writeFile, getDomainName };

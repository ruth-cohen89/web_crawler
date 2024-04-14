# Web Crawler

## Overview

The Web Crawler downloads all website pages into a local folder, ensuring each page is downloaded only once. It uses Breadth-First Search (BFS) for systematic traversal, preventing deep exploration, avoiding duplicates, supporting parallel processing, and managing memory efficiently. By traversing pages level by level and maintaining a queue of URLs, BFS ensures comprehensive coverage, prevents infinite loops, and optimizes resource usage.

## System Design

The system consists of different parts:

1. **Web Crawler Module**: Crawls the website, makes HTTP requests, parses HTML, and saves pages locally. It uses BFS algorithm to ensure...?

2. **URL Normalization**: Ensures URLs leading to the same page have the same representation to avoid duplicate downloads.

3. **File Naming Logic**: Generates filenames based on URLs to ensure uniqueness and compatibility with the filesystem.

4. **URL Extraction**: Parses HTML to extract URLs from anchor tags' href attributes.

5. **Domain Matching**: Determines if a URL belongs to the same domain as the entry point URL to prevent crawling external links.

6. **Local Folder Creation**: Creates a local folder for storing downloaded pages, organized by domain names.

## Potential Bottlenecks

Several factors may affect the performance and scalability of the web crawler:

- **Network Latency**: Fetching pages over the network may be slow, especially for large or slow websites.

- **I/O Operations**: Writing pages to the local filesystem may be slow, especially with high disk I/O.

- **Concurrency**: Processing multiple URLs concurrently can improve performance but may lead to resource contention.

- **Error Handling**: Properly handling errors during HTTP requests, HTML parsing, or filesystem operations is crucial.

- **Scalability**: As the number of pages and website complexity increases, the system should scale horizontally to handle the load.

## Scalability Considerations

To improve scalability:

- **Parallel Processing**: Implement concurrency to process multiple URLs simultaneously.

- **Distributed Architecture**: Distribute the workload across multiple servers for scalability and resilience.

- **Load Balancing**: Use a load balancer to evenly distribute requests among crawler instances.

- **Distributed File Storage**: Consider using distributed file storage solutions like Amazon S3 or Google Cloud Storage, which provide scalable and reliable storage for crawled pages.

- **Caching**: Implement caching mechanisms to store previously crawled pages and reduce redundant downloads. Consider using an in-memory caching system like Redis or Memcached, or a distributed cache.

- **Asynchronous Processing**: Utilize asynchronous programming to improve
  responsiveness and resource utilization.

- **Monitoring and Alerting**: Implement monitoring systems to detect and respond to performance issues or failures.

## Usage

Provide the entry point URL and local folder path where pages will be stored. Run the crawler script to start crawling and downloading pages.

````bash
npm start


## Dependencies
- axios
- cheerio

## Installation
```bash
npm install axios cheerio

````

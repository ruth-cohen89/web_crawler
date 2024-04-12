const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Readable } = require("stream");
const fs = require("fs");

// Configure AWS credentials and region
const s3Client = new S3Client({ region: "il-central-1" });
const bucketName = "web-crawler-service";

// Function to upload a file to S3
async function uploadFileToS3(key, filePath) {
  try {
    const uploadParams = {
      Bucket: bucketName,
      // Key is the path where you want to store the file in S3
      Key: key,
      // Body is the file stream to be uploaded
      Body: fs.createReadStream(filePath),
    };
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("File uploaded successfully:", data.$metadata.httpStatusCode);
    return true;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    return false;
  }
}

// Function to retrieve a file from S3
async function getFileFromS3(key, destinationPath) {
  try {
    const downloadParams = {
      Bucket: bucketName,
      Key: key,
    };
    const { Body } = await s3Client.send(new GetObjectCommand(downloadParams));
    const fileStream = fs.createWriteStream(destinationPath);
    Body.pipe(fileStream);
    console.log("File downloaded successfully");
    return true;
  } catch (err) {
    console.error("Error downloading file from S3:", err);
    return false;
  }
}

module.exports = {
  uploadFileToS3,
  getFileFromS3,
};

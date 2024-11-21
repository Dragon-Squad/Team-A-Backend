const fs = require("fs");
const path = require("path");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const { connectFileDB } = require('../../Config/DBConfig');

const uploadImagesFromDirectory = async (dirPath, bucketName) => {
  const fileIds = [];
  const fileNames = fs.readdirSync(dirPath);

  for (const [i, fileName] of fileNames.entries()) {
    const filePath = path.join(dirPath, fileName);

    const fileId = await uploadFile(filePath, bucketName);
    fileIds.push(fileId);
  }

  return fileIds;
};

const uploadFile = async (filePath, bucketName) => {
  try {
    const db = await connectFileDB();
    const bucket = new GridFSBucket(db, { bucketName });

    const fileName = `${Date.now()}-${path.basename(filePath)}`;

    return new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(fileName);
      const readableStream = fs.createReadStream(filePath);

      readableStream
        .pipe(uploadStream)
        .on("finish", () => resolve(uploadStream.id))
        .on("error", (err) => reject(err));
    });
  } catch (err) {
    throw err;
  }
};

module.exports = { uploadImagesFromDirectory };
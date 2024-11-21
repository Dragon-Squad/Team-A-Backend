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
    const fileBuf = fs.readFileSync(filePath);

    const fileTarget = {
      originalname: fileName,
      buffer: fileBuf,
    };

    const fileId = await uploadFile(fileTarget, bucketName);
    fileIds.push(fileId);
  }

  return fileIds;
};

const uploadFile = async (fileTarget, bucketName) => {
    try {
      const db = await connectFileDB();
      const bucket = new GridFSBucket(db, { bucketName });
  
      const fileName = `${Date.now()}-${fileTarget.originalname}`;
  
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(fileName);
        const readableStream = Readable.from(fileTarget.buffer);
  
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
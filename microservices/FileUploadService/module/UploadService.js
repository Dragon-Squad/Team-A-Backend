require('dotenv').config();
const { Readable } = require("stream");
const { GridFSBucket } = require("mongodb");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

class UploadService {
  constructor() {
    this.connectDB(); 
    console.log('Connected to FileDB');
  }

  async connectDB() {
    this.db = await mongoose.createConnection(process.env.MONGO_URI_FILE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async uploadFile(file, bucketName) {
    try {
      const bucket = new GridFSBucket(this.db, { bucketName });
  
      const fileName = `${Date.now()}-${file.originalname}`;
  
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(fileName);
        const readableStream = Readable.from(file.buffer);
  
        readableStream
          .pipe(uploadStream)
          .on("finish", () => resolve(uploadStream.id))
          .on("error", (err) => reject(err));
      });
    } catch (err) {
      throw err;
    }
  };

  async retrieveImageData(id, bucketName, res) {
    try {
      const bucket = new GridFSBucket(this.db, { bucketName });
  
      let downloadStream;
  
      // Use _id (ObjectId) if possible, otherwise assume it's a filename
      try {
        downloadStream = bucket.openDownloadStream(new ObjectId(id));
      } catch (error) {
        console.warn(`ID "${id}" is not a valid ObjectId. Attempting by filename.`);
        downloadStream = bucket.openDownloadStreamByName(id);
      }

      downloadStream.pipe(res);

      downloadStream.on('error', () => {
        res.status(404).send('Image not found');
      });
  
      // Handle successful end of stream
      downloadStream.on('end', () => {
        console.log('Image sent successfully');
      });
    } catch (error) {
      console.error(`Error retrieving image ${id}:`, error);
      throw error;
    }
  }  
}

module.exports = new UploadService();
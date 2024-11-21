const UploadService = require("./UploadService");

class UploadController {
  async uploadFiles(req, res) {
    try {
      if (!req.files) {
        return res.status(400).send("No files uploaded.");
      }

      const bucketName = req.params.bucket;
      const results = []; 

      for (const file of req.files) {
        const result = await UploadService.uploadFile(file, bucketName);
        if (result) {
          results.push(result);
        }
      }

      if (results.length > 0) {
        return res.status(200).send(results);
      } 
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async retrieveFilesByProject(req, res) {
    try {
      const fileIds = req.body.fileIds;
      const bucketName = 'project-resources';
      const results = [];
  
      for (const fileId of fileIds) {
        const imageData = await UploadService.retrieveImageData(fileId, bucketName, res);
        if (imageData) {
          results.push(imageData);
        }
      }
  
      if (results.length > 0) {
        return res.status(200).send(results);
      } 
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new UploadController();
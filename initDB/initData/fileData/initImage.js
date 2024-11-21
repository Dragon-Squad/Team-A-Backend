const path = require("path");
const { uploadImagesFromDirectory } = require('./uploadFile');

const dataDirName = "../../resources/image";
// const donorDir = path.join(__dirname, dataDirName, "donor");
const charityDir = path.join(__dirname, dataDirName, "charity");

const initImageFiles = async () => {
    try {
      // Upload images from donor folder
    //   console.log("Uploading images from donor folder...");
    //   await uploadImagesFromDirectory(donorDir, 'donor-resources');
  
      // Upload images from charity folder
      console.log("Uploading images from charity folder...");
      const fileIds = await uploadImagesFromDirectory(charityDir, 'charity-resources');
  
      console.log("Mock data uploaded successfully.");
      return fileIds;
    } catch (error) {
      console.error("Error uploading mock data:", error);
    }
};

module.exports =  { initImageFiles };
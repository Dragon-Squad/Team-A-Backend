const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://wash-wow-upload-image.appspot.com',
});

const bucket = admin.storage().bucket();

const uploadImage = async (filename, uploadFolder) => {
    try {
      const localFilePath = path.join(__dirname, `../../resources/image/${uploadFolder}/${filename}`);

      // Generate a unique file name using the current timestamp
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `image-${timestamp}-${randomStr}${path.extname(localFilePath)}`; 
      const destination = `Charitan/${uploadFolder}/${fileName}`;
  
      // Upload the file
      const file = bucket.file(destination);
      await file.save(await fs.promises.readFile(localFilePath), {
        contentType: 'auto',
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
      
      await file.makePublic();
      const [metadata] = await file.getMetadata();
      const mediaLink = metadata.mediaLink;
      const trimmedLink = mediaLink.split('/b/')[1];

      // Construct the URL with the token
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${trimmedLink}`;
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
};

module.exports = { uploadImage };

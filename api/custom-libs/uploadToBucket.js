let envProcess = require('dotenv').config({ path: '../api/custom-libs/credentials.env' })
let aws = require('aws-sdk');
let fs = require('fs');
const s3 = new aws.S3({
  endpoint: envProcess.parsed.DIGITAL_OCEAN_BUCKET_ENDPOINT,
  accessKeyId:  envProcess.parsed.DIGITAL_OCEAN_BUCKET_KEY, // :::::::: access key
  secretAccessKey:  envProcess.parsed.DIGITAL_OCEAN_BUCKET_SECRET_KEY, // :::::::: secret key
});
let uploadToBucket = {
    targetFile: '',
    targetDir: 'content-store/app-media/images/desktop',
    result:{},
    init: async(targetFile, dirType) => {
        let result
        uploadToBucket.targetFile = targetFile;
        result = await uploadToBucket.uploadFile(targetFile);
        return result;
    },
    getUniqueId: () => {
        return new Date().getTime() + Date.now().toString(36) + Math.random(1, 1200).toString(36).substr(2)
    },
    getFileType:(fileName)=>{
      let videoExtensions=['mp4','mov','wmv','webm']
      let imageExtensions=['jpg','jpeg','png']
      let extensionF = fileName.split(".")[1];
      if(videoExtensions.indexOf(extensionF) !== -1){
        uploadFile.targetDir='content-store/app-media/videos/desktop'
      }
      if(imageExtensions.indexOf(extensionF) !== -1){
        uploadFile.targetDir='content-store/app-media/images/desktop'
      }
    },
    uploadFile: async() => {
        return new Promise((resolve) => {
          let result={}
          let oldPath = uploadToBucket.targetFile.filepath;
          let fname = uploadToBucket.targetFile.originalFilename.split(".")[0];
          let extensionF = uploadToBucket.targetFile.originalFilename.split(".")[1];
          let newPath = uploadToBucket.targetDir + '/' + fname + uploadToBucket.getUniqueId() + "." + extensionF;
          console.log(oldPath, newPath)
          const file = fs.readFileSync(oldPath);
          s3.upload(
            {
              Bucket: "yopipi-cdn", // Add bucket name here
              ACL: "public-read", // Specify whether anyone with link can access the file
              Key: newPath, // Specify folder and file name
              Body: file,
            },
             {
              partSize: 10 * 1024 * 1024,
              queueSize: 10,
            }).send((error, data) => {
              if (error){
                console.log("error uploading file: ",error)
                //return res.status(500);
              } else{
                console.log("Successfully uploaded")
                // Unlink file
                fs.unlinkSync(oldPath);
                // Return file url or other necessary details
                resolve({"mediaSource":data.Location,"mediaType":extensionF,"mediaName":fname,"uploadResult":1});
              }
            });
        })
    }
}
module.exports = uploadToBucket;

let fs = require('fs');
let uploadFile = {
    targetFile: '',
    targetDir: '../files_to_pin',
    result:{},
    init: async(targetFile, dirType) => {
        uploadFile.targetDir = dirType == "file-pin" ? '../files_to_pin' : '../files_album_art';
        let result
        uploadFile.targetFile = targetFile;
        result = await uploadFile.uploadFile(targetFile);
        return result;
    },
    getUniqueId: () => {
        return new Date().getTime() + Date.now().toString(36) + Math.random(1, 1200).toString(36).substr(2)
    },
    uploadFile: async() => {
        return new Promise((resolve) => {
            let result={}
            let oldPath = uploadFile.targetFile.filepath;
            let fname = uploadFile.targetFile.originalFilename.split(".")[0];
            let extensionF = uploadFile.targetFile.originalFilename.split(".")[1];
            let newPath = uploadFile.targetDir + '/' + fname + uploadFile.getUniqueId() + "." + extensionF;
            let rawData = fs.readFileSync(oldPath)
            console.log(oldPath, newPath)
            fs.writeFile(newPath, rawData, function(error) {
                if (error){
                  console.log("error uploading file: ",error)
                }
                else{
                console.log("Successfully uploaded")
                resolve({"mediaSource":newPath,"mediaType":extensionF,"mediaName":fname,"uploadResult":1});

              }
            })
        })
    }
}
module.exports = uploadFile;

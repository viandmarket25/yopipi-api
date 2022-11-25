//app.use(express.static('public'));
//app.use(express.static('public'));
//let express = require("express");
//let bodyParser = require('body-parser');
let formidable = require('formidable');
//let jsonParser = bodyParser.json();
const multer = require('multer');
const upload = multer();
let { wrapAsync } = require('@rimiti/express-async');
const cors = require('cors');
let fs = require('fs');
const path = require('path');
// ::::::::::::::::; file uploader

let createDir = async(targetPath, addPath) => {
    fs.mkdir(path.join(targetPath, addPath), (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
    });
}
let uploadFile = {
        targetFile: '',
        targetFileName: '',
        targetDir: '../files_to_pin',
        init: async(targetFile, targetDir, file) => {
            let result
            uploadFile.targetDir = targetDir;
            uploadFile.targetFile = file;
            uploadFile.targetFileName = targetFile;
            result = await uploadFile.uploadFile(targetFile);
            return result;
        },
        getUniqueId: () => {
            return new Date().getTime() + Date.now().toString(36) + Math.random(1, 1200).toString(36).substr(2)
        },
        uploadFile: async() => {
            return new Promise((resolve) => {
                let dir_ = uploadFile.targetFileName.split('.wav').join('')
                createDir("/Users/mac/PycharmProjects/voice-recognition-tensorflow/intro_dir/", dir_)
                let oldPath = uploadFile.targetFile.filepath;
                //let fname = uploadFile.targetFile.originalFilename.split(".")[0];
                let fname = uploadFile.targetFileName.split(".")[0];
                let extensionF = uploadFile.targetFile.originalFilename.split(".")[1];
                //let newPath = uploadFile.targetDir + '/' + fname + "." + extensionF;
                let newPath = "/Users/mac/PycharmProjects/voice-recognition-tensorflow/intro_dir/" + dir_ + '/audio-' + uploadFile.targetFileName
                console.log('new directory :::::: ===', "/Users/mac/PycharmProjects/voice-recognition-tensorflow/intro_dir/" + dir_)
                console.log('new file directory :::::: ===', "/Users/mac/PycharmProjects/voice-recognition-tensorflow/intro_dir/" + dir_ + '/o' + uploadFile.targetFileName)
                let rawData = fs.readFileSync(oldPath)
                console.log('old path:::', oldPath, 'new path::', newPath)
                fs.writeFile(newPath, rawData, function(error) {
                    if (error) console.log(error)
                    console.log("Successfully uploaded")
                    return newPath;
                })
                resolve(newPath);
            })
        }
    }
    // :::::::::::::::::: end of file uploader

const formData = formidable({ multiples: true });
let http = require('http'); // Import Node.js core module
try {
    let server = http.createServer((request, result) => { //create web server
        result.setHeader('Access-Control-Allow-Origin', '*');
        result.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
        result.setHeader('Access-Control-Max-Age', 259208800); // 30 days
        result.setHeader('Pragma', 'no-cache');
        result.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type,Authorization, Access-Control-Request-Method, Access-Control-Request-Headers, Pragma");
        if (request.url.includes("/intro-user/")) {
            //result.writeHead(200);
            let catchRequest = () => {
                if (request.method === "POST") {
                    try {
                        // ::: try catch and process in comning requests
                        let resultData
                        let loginData = {}
                            // :::::::: get payload data
                        formData.parse(request, async(error, fields, files) => {
                            console.log("fields:: ", fields, "files:: ", files)
                                //loginData = JSON.parse(fields.payload)
                            let fileName = fields.fileName;
                            let filePath = '/Users/mac/PycharmProjects/voice-recognition-tensorflow/intro_dir/' + fields.filePath + '/' + fileName;
                            resultData = await uploadFile.init(fileName, filePath, files.file);
                            setTimeout(() => {
                                console.log("response timeout over, send result");
                                resultData = JSON.stringify(resultData)
                                console.log(resultData)
                                result.write(resultData);
                                result.end();
                            }, 4400)
                        })
                    } catch (error) {
                        console.debug(error)
                    }
                }
            }
            catchRequest();
        } else {
            result.end(request.url);
        }
    });
    server.listen(3002); //6 - listen for any incoming requests
    console.log('Node.js web server at port 3002 is running..')
} catch (error) {
    console.log("error: ", error)
}
//console.log("error: ", error)
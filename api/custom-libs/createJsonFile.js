// file system module to perform file operations
const fs = require('fs');
let jsonCreateFileManager = {
    /****
     * 
     * ACCEPT JSON DATA AS ARG IN INIT()
     * SAVE JSON DATA INTO FILE
     * 
     * ***/
    init: (jsonObj) => {
        //jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';
        // parse json
        console.log(jsonObj);
        // stringify JSON Object
        let jsonContent = JSON.stringify(jsonObj);
        console.log(jsonContent);
        let filePath = "../json_metadata/" + jsonCreateFileManager.createUniqueId() + "output.json"
        fs.writeFile(filePath, jsonContent, 'utf8', function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
        return filePath;
    },
    createUniqueId: () => {
        console.log(" ::::::::::   ")
        let stringV = Date.now().toString(36) + Math.random(1, 2000).toString(36).substr(2);
        return stringV;
    }
}
module.exports = jsonCreateFileManager;
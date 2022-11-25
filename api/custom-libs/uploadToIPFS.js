const axios = require('axios');
let envProcess = require('dotenv').config({ path: '../api/custom-libs/credentials.env' })
const fs = require('fs');
const FormData = require('form-data');
let pinataApiKey = envProcess.parsed.PINATA_API_KEY;
let pinataSecretApiKey = envProcess.parsed.PINATA_API_SECRET_KEY;
let pinToIPFS = {
    type: '',
    targetFile: '',
    jsonPinEndpoint: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    filePinEndpoint: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    jsonContentType: `application/json`,
    formdataContentType: `multipart/form-data;`,
    init: async(type, file) => {
        let result
        pinToIPFS.type = type;
        pinToIPFS.targetFile = file;
        if (file) {
            result = await pinToIPFS.pinFiles(pinToIPFS.targetFile);
            console.log(result);
            return result;
        }
    },
    pinFiles: async(file) => {
        let type = pinToIPFS.type;
        let jsonPinEndpoint = pinToIPFS.jsonPinEndpoint;
        let filePinEndpoint = pinToIPFS.filePinEndpoint;
        // :::::::::::: upload file
        const url = type == 'json' ? jsonPinEndpoint : filePinEndpoint;
        let data = new FormData();
        data.append('file', fs.createReadStream(file));
        data.file = file;
        let contentType = type == 'json' ? pinToIPFS.jsonContentType : pinToIPFS.formdataContentType;
        return new Promise((resolve) => {
            return axios.post(url,
                data, {
                    maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
                    headers: {
                        'Content-Type': contentType + ` boundary=${data._boundary}`,
                        'pinata_api_key': pinataApiKey,
                        'pinata_secret_api_key': pinataSecretApiKey
                    }
                }
            ).then(function(response) {
                resolve(response.data);
                return response.data;
            }).catch(function(error) {
                console.log(error);
            });
        })
    }
}
module.exports = pinToIPFS

let envProcess = require('dotenv').config({ path: '../api/custom-libs/credentials.env' })
let jwt = require('jsonwebtoken');
let uploadFile = require('./uploadFile');
let uploadToIPFS = require('./uploadToIPFS');
let createJsonFile = require('./createJsonFile');
//let nftContractManager = require('../blockchain/maticNftContract');
let connection = require('./dbConnection');
let jwtDecryptToken = envProcess.parsed.JWT_KEY; // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY; // AES :::: ENCRYPTION KEY
let pinataIpfsMachinftGateway = envProcess.parsed.PINATA_IPFS_MACHINFT_GATEWAY;
let formidable = require('formidable');
const formData = formidable({ multiples: true });
let listItem = {
    username: '',
    id: 0,
    role: '',
    masterId: '',
    token: {},
    listData: {
        soundFileType: '',
        nftTitle: '',
        nftSubTitle: '',
        nftPrice: 0,
        nftDescription: '',
        nftPriceType: '',
        soundFiles: '',
        albumFile: '',
        metadataUrl: '',
    },
    files: {
        albumFile: {},
        soundFiles: {},
    },
    filesPath: {
        albumFile: '',
        soundFiles: '',
        jsonMetadataPath: '',
    },
    ipfsPath: {
        soundFiles: '',

    },
    assetRecordResult: {},
    init: async(type, listData, files) => {
        listItem.listData.soundFileType = 'track';
        listItem.listData.nftTitle = listData.nftTitle;
        listItem.listData.nftSubTitle = listData.nftSubTitle;
        listItem.listData.nftPrice = listData.nftPrice;
        listItem.listData.nftDescription = listData.nftDescription;
        listItem.listData.nftPriceType = listData.nftPriceType;
        listItem.listData.buyNowPrice = 0;
        listItem.listData.category = 'Pop';
        listItem.listData.masterId = listItem.getUniqueId();
        listItem.listData.assetAuctionStatus = 0;
        listItem.listData.category = listData.soundFileType;
        listItem.token = listData.token;
        listItem.files.soundFiles = files.soundFiles;
        listItem.files.albumFile = files.albumFile;
        let responseData
        if (type == 'list-item') {
            listItem.decryptToken();
            if (listItem.isAuthorized()) {
                // :::::::::::::: if user is authorized to make request, list etc
                return new Promise((resolve) => {
                    listItem.createList();
                    responseData = {
                        resultCode: 1,
                        resultContent: {},
                        resultMessage: ''
                    }
                    resolve(responseData);
                })
            }
        } else if (type == 'list-and-mint') {
            // :::::::::: create list, upload file to web2 server, upload to ipfs server, mint on blockchain
            return new Promise((resolve) => {
                listItem.createList().then(
                    listItem.mintItem()).then(() => {
                    responseData = {

                    }
                    resolve(responseData);
                }).catch((error) => {
                    if (error) {
                        console.log(error)
                    }
                })
            })
        }
    },
    isAuthorized: () => {
        let result = true;
        // ::::::::::: make checks and verifications
        return result;
    },
    getMasterId: () => {
        let result;
        console.log(" ::::::::::   ")
        result = Date.now().toString(36) + Math.random().toString(36).substr(2);
        listItem.masterId = result;
    },
    decryptToken: (token) => {
        console.log("decrypt token :: ")
        token = listItem.token;
        let decodedToken = jwt.verify(token, jwtDecryptToken);
        listItem.username = decodedToken.username;
        listItem.role = decodedToken.role
        listItem.id = decodedToken.id
        console.log(decodedToken)
        return decodedToken;
    },
    createList: () => {
        console.log('create list')
            // ID, TYPE, METADATA_URL, CREATED_BY, OWNED_BY, TOKEN_ID, IS_MINTED, TITLE, SUB_TITLE, DESCRIPTION, PRICE, PRICE_TYPE, ASSET_AUCTION_STATUS, BUY_NOW_PRICE, MASTER_ID, CATEGORY	DATE_, TIME_
            // ID, TOKEN_ID, MASTER_ID, METADATA_URL, ALBUM_ART_URL, ASSET_URL, PARAM
        const current = new Date();
        const time = current.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        today.toDateString(); // "Sun Jun 14 2020"
        listItem.listData.listTime = time
        listItem.listData.listDate = today
        let result = 0
        let queryStatement = ' INSERT INTO token_asset  ( TYPE, METADATA_URL, CREATED_BY, OWNED_BY, TOKEN_ID, IS_MINTED, TITLE, SUB_TITLE, DESCRIPTION, PRICE, PRICE_TYPE, ASSET_AUCTION_STATUS, BUY_NOW_PRICE, MASTER_ID, CATEGORY, DATE_, TIME_ ) VALUES '
        let columnData = "( '" + listItem.listData.soundFileType + "' , '" + listItem.listData.metadataUrl + "'," + listItem.id + "," + listItem.id + ",2,0,'" + listItem.listData.nftTitle + "','" + listItem.listData.nftSubTitle + "','" + listItem.listData.nftDescription + "'," + listItem.listData.nftPrice + ",'" + listItem.listData.nftPriceType + "'," + listItem.listData.assetAuctionStatus + ", " + listItem.listData.buyNowPrice + ",'" + listItem.listData.masterId + "','" + listItem.listData.category + "','" + listItem.listData.listDate + "','" + listItem.listData.listTime + "' )";
        connection.query(queryStatement + columnData, function(error, result, fields) {
            // if any error while executing above query, throw error
            if (error) throw error;
            // if there is no error, you have the result
            //console.log(result);
            listItem.assetRecordResult = result;
            let uploadFiles = async() => {
                await listItem.uploadFiles();
            }
            uploadFiles();
        });
        //await listItem.uploadFiles();
        //createUser.sendVerificationMail();
        return result;
    },
    uploadFiles: async() => {
        // :::::::::: upload and pin files to SERVER and IPFS
        // listItem.filesPath.soundFiles = await uploadToIPFS.init('file', listItem.files.soundFiles);
        // :::::::: upload file to server, in our case, we upload album art
        listItem.filesPath.albumFile = await uploadFile.init(listItem.files.albumFile, "album-art");
        // :::::::: upload sound file
        listItem.filesPath.soundFiles = await uploadFile.init(listItem.files.soundFiles, "file-pin");
        // ::::::::::::::: get file path, upload to ipfs
        let ipfsFileHash = await uploadToIPFS.init('file', listItem.filesPath.soundFiles);
        // :::::::::::: append ipfs gateway with file hash, set file url,
        console.log("new ipfs hash:  ", ipfsFileHash)
        listItem.ipfsPath.soundFiles = pinataIpfsMachinftGateway + ipfsFileHash.IpfsHash;
        console.log("album art file: ", listItem.filesPath.albumFile, "music file: ", listItem.ipfsPath.soundFiles);
        listItem.filesPath.jsonMetadataPath = await listItem.createJsonMetaData();
        console.log("json metadata path: ", listItem.filesPath.jsonMetadataPath);
        // :::::::::::::::: create and upload json metadata
        let ipfsJsonFileHash = await uploadToIPFS.init('file', listItem.filesPath.jsonMetadataPath);
        listItem.listData.metadataUrl = ipfsJsonFileHash.IpfsHash;

        // :::::::::::::::: mint item on blockchain,
        listItem.mintItem();

        // :::::::::::::: after uploading nun fungible asset and json metadata, record data,
        let queryStatement_ = ' INSERT INTO token_asset_items  ( TOKEN_ID, MASTER_ID, METADATA_URL, ALBUM_ART_URL, ASSET_URL, PARAM ) VALUES '
        let columnData_ = "(  0,' " + listItem.listData.masterId + "','" + listItem.listData.metadataUrl + "','" + listItem.filesPath.albumFile + "','" + listItem.ipfsPath.soundFiles + "','param'   )  ";
        connection.query(queryStatement_ + columnData_, function(error, result, fields) {
            // if any error while executing above query, throw error
            if (error) {
                throw error;
            } else {

            }

            // if there is no error, you have the result
            //console.log(result);
        });
        // ::::::::::::::: mint asset in blockchain
    },
    createJsonMetaData: async() => {
        let jsonMetaData = {
                "name": listItem.listData.nftTitle,
                "description": listItem.listData.nftDescription,
                "price": listItem.listData.nftPrice,
                "image": listItem.filesPath.albumFile, // ::::::::::::: album art file path on server
                "audio": listItem.ipfsPath.soundFiles, // ::::::::::::: sound file path on IPFS
                "category": "",
                "quantity": 1,
                "street_address": "machinft music",
                "phone_number": "111-111-111",
                "email": "boom@gmail.com",
            }
            // ::::::::::::: pass json data to json file creator
        let jsonFile = createJsonFile.init(jsonMetaData);
        console.log(jsonMetaData);
        return jsonFile;
        // ::::::: upload json metadata, record on database for minting,
        //listItem.listData.metadataUrl = await uploadToIPFS.init('json', jsonFile);
    },
    getUniqueId: () => {
        return new Date().getTime() + Date.now().toString(36) + Math.random(1, 1200).toString(36).substr(2)
    },
    mintItem: async() => {
        // :::::::::: mint metadata url on Ethereum or Polygon Blockchain
        // nftContractManager.init(ownerAddress, contractAddress, privateKey1, options);

    },
    sendMintEmail: async() => {

    },
}
module.exports = listItem;

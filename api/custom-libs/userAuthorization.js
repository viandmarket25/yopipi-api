
let baseUrl='/Users/mac/Documents/yopipi-api/api/'
let connection = require(baseUrl+'custom-libs/dbConnection.js');
let bcrypt = require('bcrypt');
let envProcess = require('dotenv').config({ path: baseUrl+'custom-libs/credentials.env' })
let jwt = require('jsonwebtoken');
let jwtDecryptEncryptKey = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
let authorizeUser = {
    userId: '',
    username: '',
    role: '',
    resourcePath: '',
    token: {},
    sellerResourceList: [],
    buyerResourceList: [],
    init: (token, resourcePath) => {
        authorizeUser.token = token;
        authorizeUser.resourcePath = resourcePath;
        authorizeUser.decryptToken();
        return authorizeUser.isAuthorized();
    },
    isAuthorized: () => {
        let result;
        // ::::::::::: make checks and verifications
        // ::::::::::::: seller resource routes
        if (authorizeUser.role == 20 && authorizeUser.sellerResourceList.includes(authorizeUser.resourcePath)) {
            return 1;
        }
        // :::::::::::::: buyer resource routes
        if (authorizeUser.role == 10 && authorizeUser.buyerResourceList.includes(authorizeUser.resourcePath)) {
            return 1;
        }
        return 0;
        //return result;
    },
    decryptToken: (token) => {
        console.log("decrypt token :: ")
        token = "";
        let decodedToken = jwt.verify(token, jwtDecryptToken);
        authorizeUser.username = decodedToken.username;
        console.log(decodedToken);
        return decodedToken;
    }
};

    //loginUser.init("", { username: 'cryptopunk', password: 'pink' })
module.exports = authorizeUser;

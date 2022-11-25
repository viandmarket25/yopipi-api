let baseUrl='/Users/mac/Documents/yopipi-api/api/'
let connection = require(baseUrl+'custom-libs/dbConnection.js');
let bcrypt = require('bcrypt');
let envProcess = require('dotenv').config({ path: baseUrl+'custom-libs/credentials.env' })
let jwt = require('jsonwebtoken');
let jwtDecryptEncryptKey = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
let loginUser = {
        username: '',
        password: '',
        dbPassword: '',
        id: 0,
        sendResponse: {},
        canLogin: true,
        tokenData: {
            token: '',
            role: '',
            username: '',
        },
        response: {},
        init: async(type, loginData) => {
            if (type == 'login-user') {
                loginUser.username = loginData.username;
                loginUser.password = loginData.password;
                return new Promise((resolve) => {
                    loginUser.getDbPassword();
                    setTimeout(() => {
                        console.log("init timeout over, send response!")
                        resolve(loginUser.response)

                    }, 1100)
                })
            }
        },
        getDbPassword: async() => {
            let username = loginUser.username;
            let response
            let queryResult = {}
            connection.query("SELECT DISTINCT * FROM users WHERE ( users.USERNAME ='" + username + "') || ( users.EMAIL ='" + username + "') ", (error, result) => {
                if (result && result.length > 0) {
                    loginUser.tokenData.role = result[0].ROLE;
                    loginUser.tokenData.username = result[0].USERNAME;
                    queryResult = result
                    loginUser.dbPassword = queryResult[0].PASSWORD
                    loginUser.id = queryResult[0].ID
                        // :::::::::::::: compare password with hashed passwords
                    bcrypt.compare(loginUser.password, loginUser.dbPassword, (error, compareResponse) => {
                        if (compareResponse) {
                            console.log("password verified ", compareResponse)
                            let tokenToSign = {
                                    role: loginUser.tokenData.role,
                                    username: loginUser.tokenData.username,
                                    id: loginUser.id,
                                }
                                // :::::: encode token
                            loginUser.tokenData.token = jwt.sign(tokenToSign, jwtDecryptEncryptKey);
                            // :::::::::::::
                            response = {
                                resultCode: 1,
                                resultContent: loginUser.tokenData,
                                resultMessage: 'success',
                                resultTime: new Date().getTime() + Date.now().toString(36) + Math.random(1, 1200).toString(36).substr(2)
                            }
                            loginUser.response = response;
                        } else {
                            response = {
                                resultCode: 0,
                                resultContent: 0,
                                resultMessage: 'login failure',
                                resultTime: new Date().getTime() + Date.now().toString(36)
                            }
                            loginUser.response = response;
                        }
                    });
                } else {
                    response = {
                        resultCode: 0,
                        resultContent: 0,
                        resultMessage: 'login failure',
                        resultTime: new Date().getTime() + Date.now().toString(36)
                    }
                    loginUser.response = response;
                    return response;
                }
            });
        },

    }
    //loginUser.init("", { username: 'cryptopunk', password: 'pink' })
module.exports = loginUser;

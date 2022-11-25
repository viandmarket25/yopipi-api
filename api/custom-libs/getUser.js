let envProcess = require('dotenv').config({ path: '../api/custom-libs/credentials.env' })
let jwt = require('jsonwebtoken');
let jwtDecryptToken = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
    /***
    // sign with RSA SHA256
    var privateKey = fs.readFileSync('private.key');
    var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'});
    jwt.sign({
        data: 'foobar'

    }, 'secret', { expiresIn: 60 * 60 });
    // ::::::: or even better:
    ***/
    /**
     *
     * connection.query("select * from users ", (error, result) => {
            if (error) {
                console.log("error: ", error);
                result(error, null);
                return;
            }
            //console.log("created tutorial: ", { id: res.insertId, ...newTutorial });
            console.log(result)
                //result(null, { id: res.insertId, ...newTutorial });
        });
    */
let userManager = {
    username: '',
    role: '',
    token: {},
    init: (token) => {
        userManager.token = token;
        userManager.decryptToken();
        return userManager.isAuthorized();
    },
    isAuthorized: () => {
        let result;
        // ::::::::::: make checks and verifications

        return result;
    },
    decryptToken: (token) => {
        console.log("decrypt token :: ")
        token = "";
        let decodedToken = jwt.verify(token, jwtDecryptToken);
        userManager.username = decodedToken.username;
        console.log(decodedToken)
        return decodedToken;
    }
}
module.exports = userManager;

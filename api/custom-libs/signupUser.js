let connection = require('./dbConnection');
let bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
let createUser = {
    userJoinData: {
        username: "",
        password: "",
        email: "",
        role: 10,
        regDate: "",
        regTime: "",
    },
    response: {},
    init: async(type, payload) => {
        // ::::::::: type [ create user || verify email ]
        //console.log(joinData)
        createUser.userJoinData.password = payload.password;
        createUser.userJoinData.username = payload.username;
        createUser.userJoinData.email = payload.email;
        if (type == 'create-user') {
            // :::::: hash password and create user
            let createUserResult = await createUser.hashPassword(createUser.userJoinData.password);
            return createUser.response;
        } else if (type == 'verify-email') {
            createUser.verifyUserEmail();
        }
    },
    createETHWallet: () => {

    },
    sendVerificationMail: async() => {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        let bb = " We are happy you have joined us in this race, Machinft allows you to play music and other interesting audio contents, If you are only interested in  investing, we have developed user friendly tools to help you make the most out of the artists or creators you care about,";
        let ms = "Welcome once again, We are happy to have you. ";
        let mailMessage = "<b>Hello, " + createUser.userJoinData.username + "</b><br/>" + bb + "<br/>" + ms;
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Team Machinft" team@machinft.com', // sender address
            //to: "viandmarket@outlook.com, baz@example.com", // list of receivers
            to: "viandmarket@outlook.com",
            subject: "Welcome to Machinft ✔", // Subject line
            //text: "Hello world?", // plain text body
            html: mailMessage,
            // html body
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    },
    verifyUserEmail: () => {
        // :::::: after verifying user email, create wallet address
        createUser.createETHWallet();
    },
    hashPassword: async(password) => {
        let saltRounds = 12;
        /***
         * hash plain password text, then use hashed password to store in database
         * **/
        return new Promise((resolve) => {
            bcrypt.hash(password, saltRounds).then((result) => {
                createUser.userJoinData.password = result
                createUser.createUser()
                resolve(result)
            }).catch((error) => {
                console.log(error)
            }).then((error) => {

            })
        })
    },
    verifyHashedPassword: () => {
        /* Here we can compare the hashed password after we get it from
        the database with the plaintext password */
        bcrypt.compare(myPlaintextPassword, hash, function(error, response) {
            console.log(response)
                // response == true if they match
                // response == false if password is wrong
        });
    },
    createUser: async(userJoinData) => {
        // ID, USERNAME,	EMAIL, EMAIL_VERIFIED, ROLE, PHONE_NUMBER, FIRSTNAME, LASTNAME, PASSWORD, ADDRESS_1 ADDRESS_2, COUNTRY,	POSTAL_CODE,	CITY, REGION,	REG_DATE, REG_TIME
        const current = new Date();
        const time = current.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        today.toDateString(); // "Sun Jun 14 2020"
        //let date = current.getDate() + "/ " + current.getMonth() + 1 + "/ " + current.getFullYear()
        createUser.userJoinData.regTime = time
        createUser.userJoinData.regDate = today
            //createUser.userJoinData.password =
        let result = 0
        let queryStatement = ' INSERT INTO users  ( USERNAME, EMAIL, EMAIL_VERIFIED, ROLE, PHONE_NUMBER, FIRSTNAME, LASTNAME, PASSWORD, ADDRESS_1, ADDRESS_2, COUNTRY,	POSTAL_CODE,	CITY, REGION,	REG_DATE, REG_TIME) VALUES '
        let columnData = "( '" + createUser.userJoinData.username + "' , '" + createUser.userJoinData.email + "' ,0, " + createUser.userJoinData.role + " ,80,'NAME','LAST', '" + createUser.userJoinData.password + "' ,'ADDR','ADDR','COUNTRY','PST C','CITY','REG', '" + createUser.userJoinData.regDate + "' , '" + createUser.userJoinData.regTime + "'  )";
        connection.query(queryStatement + columnData, function(error, result, fields) {
            // if any error while executing above query, throw error
            if (error) throw error;
            // if there is no error, you have the result
            console.log(result);
        });
        createUser.response = {
            resultCode: 1,
            resultMessage: 'success',
            resultContent: result,
        }
        createUser.sendVerificationMail();
        return result;

    }
}

module.exports = createUser;

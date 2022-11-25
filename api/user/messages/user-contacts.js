let baseUrl='/Users/mac/Documents/yopipi-api/api/'
let envProcess = require('dotenv').config({ path: baseUrl+'custom-libs/credentials.env' })
let jwt = require('jsonwebtoken');
let jwtDecryptToken = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
let connection = require(baseUrl+'custom-libs/dbConnection.js');
let helperFunc=require(baseUrl+'custom-libs/helperFunc.js')
let mysql = require('mysql');

let userContacts={
  db_Connection :'',
  action:'',
  payload:'',
  token:'',
  resultCode:0,
  resultContent:'',
  resultMessage:'',
  sender:'jane',
  receiver:'borden',
  /************************************************************************************************
   *
   *
   ****************************************************************/
  init:async(auth_crd,action,pushFiles,payload)=>{
    return new Promise((resolve) => {
        console.log('request here:: ')
        userContacts.db_Connection = connection;
        userContacts.action=action;
        userContacts.payload = payload;
        userContacts.token =auth_crd;
        //userContacts.getUser();
        userContacts.checkUserRole( );
        setTimeout(() => {
            resolve(userContacts.result);
        }, 400)
    })
  },
  getUser:()=>{
      let decoded = jwt.verify(userContacts.token, jwtDecryptToken);
      userContacts.userId=decoded.id;
      userContacts.username=decoded.username;
      userContacts.role=decoded.role;
      console.log(decoded)
  },
  checkUserRole:async()=>{
      // :::::::::::::::::: check user role if role permits, run operation
      // if( userContacts.role==10 ){
          // ::::::::::: get single product information
          await userContacts.getContacts();

      // }
  },
  getContacts:async()=>{
    return new Promise(async(resolve) => {
      let connection=userContacts.db_Connection;
      let messageList=[];
      let queryTarget=[userContacts.sender,userContacts.receiver];
      let queryStatement="SELECT DISTINCT * FROM users ";
      let executeQuery = mysql.format(queryStatement );
      let sender=userContacts.sender
      let receiver=userContacts.receiver

      connection.query(executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
          let indexObject=0;
          Object.keys(result).forEach(function(key) {
            let row = result[key];
            let messageResult = {

            };
            //messageResult['username']=receiver;
            if(row['USERNAME']!==''){
              messageResult['userID']=row['ID'];
              messageResult['username']=row['USERNAME'];
              messageResult['email']=row['EMAIL'];
              messageResult['phone_number']=row['PHONE_NUMBER'];
              messageResult['contactType']=0;
              messageResult['first_name']=row['FIRST_NAME'];
              messageResult['last_name']=row['LAST_NAME'];
              messageResult['avatar']='' // $timeStampMaster->get_output_Time($row['DATE'],$row['TIME']);
              messageList.push(messageResult);


            }

         });
        }
        console.log(messageList)
        userContacts.resultContent=messageList;
        userContacts.resultMessage='Results Received';
        userContacts.resultCode=1;
        let result_= JSON.stringify( {"resultMessage":userContacts.resultMessage,"resultCode":userContacts.resultCode,"resultContent":userContacts.resultContent} )
        userContacts.result= result_

        resolve(result_);

      });

    })
  },
}

module.exports=userContacts;

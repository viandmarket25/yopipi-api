let baseUrl='/Users/mac/Documents/yopipi-api/api/'
let envProcess = require('dotenv').config({ path: baseUrl+'custom-libs/credentials.env' })
let jwt = require('jsonwebtoken');
let jwtDecryptToken = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
let connection = require(baseUrl+'custom-libs/dbConnection.js');
let helperFunc=require(baseUrl+'custom-libs/helperFunc.js')
let mysql = require('mysql');

let userFriendMessages={
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
        userFriendMessages.db_Connection = connection;
        userFriendMessages.action=action;
        userFriendMessages.payload = payload;
        userFriendMessages.token =auth_crd;
        //userFriendMessages.getUser();
        userFriendMessages.checkUserRole( );
        setTimeout(() => {
            resolve(userFriendMessages.result);
        }, 400)
    })
  },
  getUser:()=>{
      let decoded = jwt.verify(userFriendMessages.token, jwtDecryptToken);
      userFriendMessages.userId=decoded.id;
      userFriendMessages.username=decoded.username;
      userFriendMessages.role=decoded.role;
      console.log(decoded)
  },
  checkUserRole:async()=>{
      // :::::::::::::::::: check user role if role permits, run operation
      // if( userFriendMessages.role==10 ){
          // ::::::::::: get single product information
          await userFriendMessages.getMessages();

      // }
  },
  getContacts:async()=>{
    // ::::::::::::: get contacts
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
  getMessages:async()=>{
    return new Promise(async(resolve) => {
      let connection=userFriendMessages.db_Connection;
      let messageList=[];
      let queryTarget=[userFriendMessages.sender,userFriendMessages.receiver];
      let queryStatement="SELECT DISTINCT * FROM chat_message_table  WHERE ( SENDER =? OR SENDER=? ) AND (RECEIVER =? OR RECEIVER=?)  ";
      let executeQuery = mysql.format(queryStatement, [queryTarget[0],queryTarget[1],queryTarget[0],queryTarget[1]]  );
      let sender=userFriendMessages.sender
      let receiver=userFriendMessages.receiver

      connection.query(executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
          let indexObject=0;
          Object.keys(result).forEach(function(key) {
            let row = result[key];
            let messageResult = {

            };
            messageResult['username']=receiver;
            messageResult['sender']=row['SENDER'];
            messageResult['receiver']=row['RECEIVER'];
            messageResult['messageContent']=row['MESSAGE'];
            messageResult['messageType']=row['MESSAGE_TYPE'];
            messageResult['messageDate']=row['DATE']; // $timeStampMaster->get_output_Time($row['DATE'],$row['TIME']);
            messageResult['messageTime']=row['TIME'];
            messageList.push(messageResult);

         });
        }
        console.log(messageList)
        userFriendMessages.resultContent=messageList;
        userFriendMessages.resultMessage='Results Received';
        userFriendMessages.resultCode=1;
        let result_= JSON.stringify( {"resultMessage":userFriendMessages.resultMessage,"resultCode":userFriendMessages.resultCode,"resultContent":userFriendMessages.resultContent} )
        userFriendMessages.result= result_

        resolve(result_);

      });

    })
  },
}

module.exports=userFriendMessages;

let baseUrl='/Users/mac/Documents/yopipi-api/api/'
let envProcess = require('dotenv').config({ path: baseUrl+'custom-libs/credentials.env' })
let jwt = require('jsonwebtoken');
let jwtDecryptToken = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
let connection = require(baseUrl+'custom-libs/dbConnection.js');
let helperFunc=require(baseUrl+'custom-libs/helperFunc.js')
let mysql = require('mysql');
let userRecentMessages={
  db_Connection :'',
  action:'',
  payload:'',
  token:'',
  resultCode:0,
  resultContent:'',
  resultMessage:'',
  sender:'jane',
  receiver:'borden',
  userContactList:[],
  recentMessagesList:[],
  /************************************************************************************************
   *
   *
   ****************************************************************/
  init:async(auth_crd,action,pushFiles,payload)=>{
    return new Promise((resolve) => {
        console.log('request here:: ')
        userRecentMessages.db_Connection = connection;
        userRecentMessages.action=action;
        userRecentMessages.payload = payload;
        userRecentMessages.token =auth_crd;
        //userRecentMessages.getUser();
        userRecentMessages.checkUserRole( );
        setTimeout(() => {
            resolve(userRecentMessages.result);
        }, 400)
    })
  },
  getUser:()=>{
      let decoded = jwt.verify(userRecentMessages.token, jwtDecryptToken);
      userRecentMessages.userId=decoded.id;
      userRecentMessages.username=decoded.username;
      userRecentMessages.role=decoded.role;
      console.log(decoded)
  },
  checkUserRole:async()=>{
      // :::::::::::::::::: check user role if role permits, run operation
      // if( userRecentMessages.role==10 ){
          // ::::::::::: get single product information
          await userRecentMessages.getContacts();
      // }
  },
  getContacts:async()=>{
    // ::::::::::::: get contacts
    userRecentMessages.userContactList=[]
    userRecentMessages.recentMessagesList=[]

    return new Promise(async(resolve) => {
      let connection=userRecentMessages.db_Connection;
      let messageList=[];
      let queryTarget=[userRecentMessages.sender,userRecentMessages.receiver];
      let queryStatement="SELECT DISTINCT * FROM users WHERE ID!=? ";
      let executeQuery = mysql.format(queryStatement,queryTarget[0] );
      let sender=userRecentMessages.sender
      let receiver=userRecentMessages.receiver
      connection.query(executeQuery,async function(error,result,fields) {
        if (error){
          throw error;
        }else{
          let indexObject=0;
          Object.keys(result).forEach(function(key) {
            let row = result[key];
            let contactResult = {

            };
            //messageResult['username']=receiver;
            if(row['USERNAME']!==''){
              contactResult['userID']=row['ID'];
              contactResult['username']=row['USERNAME'];
              contactResult['email']=row['EMAIL'];
              contactResult['phoneNumber']=row['PHONE_NUMBER'];
              contactResult['contactType']=0;
              contactResult['firstName']=row['FIRST_NAME'];
              contactResult['lastName']=row['LAST_NAME'];
              contactResult['avatar']='' // $timeStampMaster->get_output_Time($row['DATE'],$row['TIME']);
              contactResult['totalMessages']=0
              contactResult['lastMessage']=''
              contactResult['messageList']=[]

              userRecentMessages.userContactList.push(contactResult);
            }
         });
        }
        /*
        user_id.add("123");
        //----to be gotten later
        user_names_.add(recentMessengers.get(list)["username"]);
        user_messages_.add(recentMessengers.get(list)["messageContent"]);
        message_count_.add(list);
        message_date_.add(recentMessengers.get(list)["messageDate"]);
        */

        let recentMessages=[];
        for(let i=0; i<userRecentMessages.userContactList.length;i++ ){
          console.log('username:: ',userRecentMessages.userContactList[i]['username'])
          userRecentMessages.receiver = userRecentMessages.userContactList[i]['username'];
          let msg = await userRecentMessages.getMessages(userRecentMessages.sender, userRecentMessages.userContactList[i]['username']  );
          msg=JSON.parse(msg);
          let lastMessage
          let totalMessages
          if(msg.length>0){
            console.log('msg length:',msg.length)
            lastMessage=msg[msg.length-1]['messageContent'];
            totalMessages=msg.length;

          }else{
            lastMessage=''
            totalMessages=0



          }
          //console.log(msg)
          //let totalMessages=msg.length;
          // ::::::::::::: messages result
          /*
          resolve(
            JSON.stringify(
              {
                "totalMessages":totalMessages,
                "lastMessage":lastMessage
              }
            )
          );
          */
          //msg=JSON.parse(msg);
          userRecentMessages.userContactList[i]['totalMessages']=totalMessages
          userRecentMessages.userContactList[i]['lastMessage']=lastMessage
          userRecentMessages.userContactList[i]['messageList']=msg

          if( userRecentMessages.sender != userRecentMessages.userContactList[i]['username'] ){
              recentMessages.push(
                {
                  [userRecentMessages.userContactList[i]['username']]:userRecentMessages.userContactList[i]
                }
              )
          }else{
            recentMessages.push(
              {
                [userRecentMessages.userContactList[i]['username']]:userRecentMessages.userContactList[i]
              }
            )
          }
        }

        console.log("recent messages: ",recentMessages)




        userRecentMessages.resultContent=recentMessages;
        userRecentMessages.resultMessage='Results Received';
        userRecentMessages.resultCode=1;
        let result_= JSON.stringify( {"resultMessage":userRecentMessages.resultMessage,"resultCode":userRecentMessages.resultCode,"resultContent":userRecentMessages.resultContent} )
        userRecentMessages.result = result_
        resolve(result_);
      });
    })

  },
  getMessages:async(sender,receiver)=>{
    console.log(sender,receiver)
    userRecentMessages.sender=sender
    userRecentMessages.receiver=receiver
    return new Promise(async(resolve) => {
      let connection=userRecentMessages.db_Connection;
      let messageList=[];
      let queryTarget=[userRecentMessages.sender,userRecentMessages.receiver];
      let queryStatement="SELECT DISTINCT * FROM chat_message_table  WHERE ( SENDER =? OR SENDER=? ) AND (RECEIVER =? OR RECEIVER=?)  ";
      let executeQuery = mysql.format(queryStatement, [queryTarget[0],queryTarget[1],queryTarget[0],queryTarget[1]]  );
      let sender=userRecentMessages.sender
      let receiver=userRecentMessages.receiver
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
        resolve(JSON.stringify(messageList));

      });
    })
  },
}
module.exports=userRecentMessages;

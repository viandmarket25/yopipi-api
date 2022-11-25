let baseUrl='../api/custom-libs/'
let envProcess = require('dotenv').config({ path: baseUrl+'credentials.env' })
let jwt = require('jsonwebtoken');
let jwtDecryptToken = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
let connection = require('../'+baseUrl+'dbConnection.js');
let uploadFile = require('../'+baseUrl+'uploadFile.js');
let uploadToBucket=require('../'+baseUrl+'uploadToBucket.js');
let helperFunc=require('../'+baseUrl+'helperFunc.js')
let mysql = require('mysql');
let buyerSearchProduct={
  /************************************************************************************************
   *
   *
   ****************************************************************/
  db_Connection:'',
  username:'',
  role:'',
  payload:'',
  pushFiles:'',
  result:'',
  action:'',
  auth_crd:'',
  userId:0,
  resultMessage:'',
  resultCode:'',
  resultContent:'',
  token:'',
  serverKey:'', // SERVER KEY
  // :::::::::::::::::::::::::::::::::::::::::
  title:'',
  description:'',
  stockCapacity:'',
  productCategory:'',
  state:'',
  productIsVisible:'',
  createdBy:'',
  masterId:'',
  weight:'',
  brand:'',
  gender:'',
  hasVariations:'',
  date_:'',
  time_:'',
  // :::::::::::::::::::::::::::::::::::::::::::::::::
  productVariations:'',
  productMedia:'',
  productMoreMedia:'',
  productMediaFiles:'',
  productMoreMediaFiles:'',
  productVariationFiles:'',
  // :::::::::::::::::::::::::::::::::::::::::::::::::
  productId:0,
  productVariationId:0,
  fileUploadHelper:'',
  init:async(auth_crd,action,pushFiles,payload)=>{
    return new Promise((resolve) => {
        console.log('request here:: ')
        buyerSearchProduct.db_Connection = connection;
        buyerSearchProduct.action=action;
        buyerSearchProduct.payload = payload;
        buyerSearchProduct.token =auth_crd;
        buyerSearchProduct.getUser();
        buyerSearchProduct.checkUserRole( );
        setTimeout(() => {
            resolve(buyerSearchProduct.result);
        }, 400)
    })
  },
  getUser:()=>{
      let decoded = jwt.verify(buyerSearchProduct.token, jwtDecryptToken);
      buyerSearchProduct.userId=decoded.id;
      buyerSearchProduct.username=decoded.username;
      buyerSearchProduct.role=decoded.role;
      console.log(decoded)
  },
  checkUserRole:async()=>{
      // :::::::::::::::::: check user role if role permits, run operation
      if(buyerSearchProduct.role==10){
          // ::::::::::: get single product information
          await buyerSearchProduct.searchProductFromText();
      }
  },
  searchProductFromText:async()=>{
    return new Promise(async(resolve) => {
      let connection=buyerSearchProduct.db_Connection;
      let search_keyword=helperFunc.addslashes(buyerSearchProduct.payload['searchQuery']);
      console.log(search_keyword)
      let queryResult=[];
      search_keyword=  search_keyword.toLowerCase() //strtolower(search_keyword);
      let cutChars=["-",".","(",")","[","]","{","}","/","\\","|","<",">","*","?","!","'","\"," ];
      for(let i=0; i<cutChars.length; i++){
        search_keyword.split(cutChars[i]).join("%");
      }
      search_keyword.split("%").join("\%");
      let queryString='%'+search_keyword+'%'
      let total=0
      let queryStatement="SELECT DISTINCT products.ID,products.TITLE,products.CREATED_BY,products.MASTER_ID FROM products WHERE `TITLE` LIKE ? ORDER BY products.ID ASC    "
      let executeQuery = mysql.format(queryStatement, [queryString,queryString,queryString]  );
      let ProductIds=[]
      connection.query(executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
          let indexObject=0;
          Object.keys(result).forEach(function(key) {
            if( ProductIds.indexOf(result[key]['ID'])==-1 ){
              ProductIds.push(result[key]['ID'])
              let row = result[key];
              row['MEDIA_SOURCE']= row['MEDIA_SOURCE'].split("yopipi-cdn.sgp1.digitaloceanspaces.com").join("cdn.yopipi.com");
              total=total+1
              // ::::::::::::::: selection loop
              console.log(row)
              queryResult.push(row);
              productId=row['ID'];
              createdBy=row['CREATED_BY'];
              masterId=row['MASTER_ID'];
              productAvatar='';
              _targetTable="`product_media`";
              // :::::::::::::::
             indexObject+=1;
            }
         });
        }
        console.log(queryResult)
        buyerSearchProduct.resultContent=queryResult;
        buyerSearchProduct.resultMessage='Results Received';
        buyerSearchProduct.resultCode=1;
        let result_=JSON.stringify( {"resultMessage":buyerSearchProduct.resultMessage,"resultCode":buyerSearchProduct.resultCode,"resultContent":buyerSearchProduct.resultContent} )
        buyerSearchProduct.result= result_
        resolve(result_);

      });
  })
  },
}
module.exports = buyerSearchProduct;

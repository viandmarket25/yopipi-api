let baseUrl='../api/custom-libs/'
let envProcess = require('dotenv').config({ path: baseUrl+'credentials.env' })
//let loginUser = require('../api/custom-libs/loginUser');
let jwt = require('jsonwebtoken');
let jwtDecryptToken = envProcess.parsed.JWT_KEY // JWT :::: ENCRYPTION KEY
let encryptionKey = envProcess.parsed.ENCRYPTION_KEY // AES :::: ENCRYPTION KEY
let connection = require('../'+baseUrl+'dbConnection.js');
let uploadFile = require('../'+baseUrl+'uploadFile.js');
let uploadToBucket=require('../'+baseUrl+'uploadToBucket.js');
let helperFunc=require('../'+baseUrl+'helperFunc.js')
let mysql = require('mysql');
//console.log(baseUrl+'credentials.env',envProcess,connection,uploadFile)
/********************************
 * ID, TITLE, DESCRIPTION, PRICE, STOCK_CAPACITY, PRODUCT_CATEGORY,	STATE, PRODUCT_IS_VISIBLE, CREATED_BY,PRODUCT_TYPE,MATERIAL_TYPE, MASTER_ID, WEIGHT, BRAND, GENDER, HAS_VARIATIONS, DATE_,	TIME_
 *
 *********************************/
let productInformation={
  /************************************************************************************************
   * {"productAttributes":{"title":"","description":"","price":"3","stockCapacity":"1","productCategory":"Laptops",
   *  "state":"New","weight":"2","brand":"None","gender":"Unisex","productIsVisible":true,"productType":"product",
   * "materialType":"Cutton"},"productMedia":[],"productMoreMedia":[],"productVariation":{},"productHasVariation":false}
   * "productAttributes":{}
   * "productMedia":[]
   * "productMoreMedia":[]
   * "productVariation":{}
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
        productInformation.db_Connection = connection;
        productInformation.action=action;
        productInformation.payload = payload;
        productInformation.token =auth_crd;
        productInformation.pushFiles = pushFiles;
        // ::::::::::::::::::::::::::::
        productInformation.getUser();
        productInformation.checkUserRole( );
        setTimeout(() => {
            resolve(productInformation.result);
        }, 1100)
    })
  },
  getUser:()=>{
      let decoded = jwt.verify(productInformation.token, jwtDecryptToken);
      productInformation.userId=decoded.id;
      productInformation.username=decoded.username;
      productInformation.role=decoded.role;
      console.log(decoded)
  },
  checkUserRole:async()=>{
      // :::::::::::::::::: check user role if role permits, run operation
      if(buyerSearchProduct.role==10){
          // ::::::::::: get single product information
          await buyerSearchProduct.  getProductDetailsByIdBuyer();
      }
  },
  getProductDetailsByIdBuyer:()=>{
      // :::::::::::::: product result array
      let product={"productAttributes":[],"productMedia":[],"productMoreMedia":[],"productVariations":[]};
      let connection=productInformation.db_Connection;
      let productId=productInformation.payload['productId'];
      let queryData=[productId]
      let total=0

      //  ::::::::::::: product attributes
      let queryStatement="SELECT DISTINCT * FROM `products` WHERE `products`.ID=? ORDER BY ID DESC "
      let executeQuery = mysql.format(queryStatement,queryData );
      connection.query(executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
          product['productAttributes']=result[0];
          //masterId=row['MASTER_ID'];
          //let _row=result[0]
           //productInformation.resultContent=_row;
        }
      });
      //  :::::::::: product media
      let queryData_=[productId]
      let total_=0
      let queryStatement_="SELECT DISTINCT * FROM `product_media` WHERE `product_media`.PRODUCT_ID=?  "
      let executeQuery_ = mysql.format(queryStatement_,queryData_ );
      connection.query(executeQuery_, function(error,result,fields) {
        if (error){
          throw error;
        }else{
           Object.keys(result).forEach(async function(key) {
             let row = result[key];
             row['MEDIA_SOURCE']= row['MEDIA_SOURCE'].split("yopipi-cdn.sgp1.digitaloceanspaces.com").join("cdn.yopipi.com");
             product['productMedia'].push(row);

           });
        }
      });
      //  :::::::::: product more media
      let queryData__=[productId]
      let total__=0
      let queryStatement__="SELECT DISTINCT * FROM `product_more_media` WHERE `product_more_media`.PRODUCT_ID=?  "
      let executeQuery__ = mysql.format(queryStatement__,queryData_ );
      connection.query(executeQuery__, function(error,result,fields) {
        if (error){
          throw error;
        }else{
           Object.keys(result).forEach(async function(key) {
             let row = result[key];
             row['MEDIA_SOURCE']= row['MEDIA_SOURCE'].split("yopipi-cdn.sgp1.digitaloceanspaces.com").join("cdn.yopipi.com");
             product['productMoreMedia'].push(row);
           });
        }
      });

      // ::::::::: product variations
      let productVariationIdList=[];
      let queryData__=[masterId]
      let productVariations__queryStatements="SELECT DISTINCT * FROM product_variation WHERE product_variation.PRODUCT_ID=?  ";
      let productVariations__execQuery = mysql.format(queryStatement__,queryData_ );
      connection.query(productVariations__execQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
           Object.keys(result).forEach(async function(key) {
            let row = result[key];
            productVariationIdList.push(row['ID'])
            let productVariation={
               id:row['ID'],
               masterId:row['MASTER_ID'],
               variationMasterId:row['VARIATION_MASTER_ID'],
               productId:row['PRODUCT_ID'],
               title:row['TITLE'],
               isPriceVariation:row['IS_PRICE_VARIATION'],
               variationType:row['VARIATION_TYPE'],
               date:row['DATE_'],
               time:row['TIME_'],
               options:[],
             }

             product['productVariations'].push(productVariation);
           });
        }
      });

      // :::::::::::::::::: product variation options
      for(let i=0; i<productVariationIdList.length; i++){
        product['productVariations'][i].push()
        let queryData__=[productVariationIdList[i]]
        let productVariations__queryStatements="SELECT DISTINCT * FROM product_variation_options WHERE product_variation_options.VARIATION_ID=? ";
        let productVariations__execQuery = mysql.format(productVariations__queryStatements, queryData__ );
        connection.query(productVariations__execQuery, function(error,result,fields) {
          if (error){
            throw error;
          }else{
             Object.keys(result).forEach(async function(key) {
              let row = result[key];
              row['MEDIA_SOURCE']= row['MEDIA_SOURCE'].split("yopipi-cdn.sgp1.digitaloceanspaces.com").join("cdn.yopipi.com");
              product['productVariations'].push(productVariation);
             });
          }
        });
      }



      //echo json_encode(array("resultMessage"=>"success","resultCode"=>1,"resultContent"=>$product) );
      let result=JSON.stringify({"resultMessage":"success","resultCode":1,"resultContent":product })
      productInformation.resultContent=result
      console.log(result)




  },
}
module.exports = productInformation;

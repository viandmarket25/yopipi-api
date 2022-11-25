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
let manageProduct={
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
        manageProduct.db_Connection = connection;
        manageProduct.action=action;
        manageProduct.payload = payload;
        manageProduct.token =auth_crd;
        if( manageProduct.payload['productVariation']!==''){
            manageProduct.productVariations =manageProduct.payload['productVariation'];
        }
        if(manageProduct.payload['productMedia']!==''){
            manageProduct.productMedia =manageProduct.payload['productMedia'];
        }
        if(manageProduct.payload['productMoreMedia']!==''){
            manageProduct.productMoreMedia =manageProduct.payload['productMoreMedia'];
        }
        manageProduct.pushFiles = pushFiles;
        // ::::::::::::::::::::::::::::
        try{
            if( manageProduct.pushFiles['productMedia[]']!==''   ){
                manageProduct.productMediaFiles = manageProduct.pushFiles['productMedia[]'];
                //console.log(manageProduct.productMediaFiles)
            }
        }catch(exception){}
        try{
            if( manageProduct.pushFiles['productMoreMedia[]']!==''  ){
                manageProduct.productMoreMediaFiles = manageProduct.pushFiles['productMoreMedia[]'];
                //console.log(manageProduct.productMoreMediaFiles)
            }
        }catch(exception){}
        manageProduct.getUser();
        manageProduct.checkUserRole( );
        setTimeout(() => {
            resolve(manageProduct.result);
        }, 1100)
    })
  },
  getUser:()=>{
      let decoded = jwt.verify(manageProduct.token, jwtDecryptToken);
      manageProduct.userId=decoded.id;
      manageProduct.username=decoded.username;
      manageProduct.role=decoded.role;
      console.log(decoded)
  },
  checkUserRole:async()=>{
      // :::::::::::::::::: check user role if role permits, run operation
      if(manageProduct.action=="cr_product" && (manageProduct.role==20)){
          // :::::::::: create product
        await  manageProduct.createProduct();
      }else if(manageProduct.action=="upd_product" && (manageProduct.role==20)){
          // :::::::::: update product
          manageProduct.updateProduct();
      }else if(manageProduct.action=="del_product" && (manageProduct.role==20)){
          // :::::::::: delete product
          manageProduct.deleteProduct();
      }else if(manageProduct.action=="gll_product"){
          // ::::::::::: get all products listed by the seller
          await manageProduct.getAllProductsBySeller();
      }else if(manageProduct.action=="sng_product"){
          // ::::::::::: get single product information
      }else if(manageProduct.action=="srch_product"){
          // ::::::::::: get single product information
          manageProduct.searchProducts();
      }else if(manageProduct.action=="gprid_byr_product"){
          // ::::::::::: get single product information
          manageProduct.getProductDetailsByIdBuyer();
      }
      //gprid_byr_product
  },
  getShopId:()=>{

  },
  recordProductBasicInfo:async()=>{
      // :::::::::: ID, TITLE, DESCRIPTION, PRICE, STOCK_CAPACITY, PRODUCT_CATEGORY,	STATE, PRODUCT_IS_VISIBLE, CREATED_BY,PRODUCT_TYPE,MATERIAL_TYPE, MASTER_ID, WEIGHT, BRAND, GENDER, HAS_VARIATIONS, DATE_,	TIME_
      let connection=manageProduct.db_Connection;
      let payload=manageProduct.payload;
      let id=null; // :::[ auto increment : NULL ]
      let created_by=helperFunc.convertToNumber(manageProduct.userId); // :::[ INT ]
      let shop_id=12;
      //$shop_id=intval(manageProduct.payload['productAttributes']['shopId']); // :::[ INT ]
      let title=helperFunc.addslashes(manageProduct.payload['productAttributes']['title']); // :::[ STRING ]
      let description=helperFunc.addslashes(manageProduct.payload['productAttributes']['description']); // :::[ STRING ]
      let specifications=''
      let price=helperFunc.convertToNumber(manageProduct.payload['productAttributes']['price']); // :::[ FLOAT ]
      let productDiscount=0
      let discountType='none'
      let stock_capacity=helperFunc.convertToNumber(manageProduct.payload['productAttributes']['stockCapacity']); // :::[ INT ]
      let product_category=helperFunc.addslashes(manageProduct.payload['productAttributes']['productCategory']); // :::[ STRING]
      let state=helperFunc.addslashes(manageProduct.payload['productAttributes']['state']); // :::[ STRING ]
      let product_is_visible=Number(manageProduct.payload['productAttributes']['productIsVisible']); // :::[ INT ]
      let product_type =helperFunc.addslashes(manageProduct.payload['productAttributes']['productType']); // :::[ STRING ]
      let material_type=helperFunc.addslashes(manageProduct.payload['productAttributes']['materialType']); // :::[ STRING ]
      let master_id=manageProduct.masterId; // :::[ STRING ]

      let weight=helperFunc.convertToNumber(manageProduct.payload['productAttributes']['weight']); // :::[ FLOAT ]
      let brand=helperFunc.addslashes(manageProduct.payload['productAttributes']['brand']); // :::[ STRING ]
      let gender="";
      let hasVariations=0;
      let date_ = helperFunc.getTime('time');
      let time_ = helperFunc.getTime('date');
      let columnData =[ id,title,description,specifications,price,productDiscount,discountType,stock_capacity,product_category, state,product_is_visible,created_by,shop_id ,product_type,material_type,master_id,weight,brand,gender,hasVariations,date_,time_ ];
      let total=0
      let queryStatement = " INSERT INTO `products` VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) "
      let executeQuery = mysql.format(queryStatement, columnData );
      connection.query(executeQuery, function(error, result, fields) {
          if (!error){
            manageProduct.productId=result.insertId
            manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
          } else{
            manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
              throw error;
          }
      });
  },
  searchProducts:()=>{
      let connection=manageProduct.db_Connection;
      let search_keyword=helperFunc.addslashes(manageProduct.payload['queryValue']);
      search_keyword=strtolower(search_keyword);
      let cutChars=["-",".","(",")","[","]","{","}","/","\\","|","<",">","*","?","!","'","\"," ];
      for(let i=0; i<cutChars.length; i++){
        search_keyword.split(cutChars[i]).join("%");
      }
      search_keyword.split("%").join("\%");
      let queryString='%'+search_keyword+'%'
      let total=0
      let queryStatement="SELECT * FROM `products` WHERE `TITLE` LIKE ? OR `DESCRIPTION` LIKE ? OR `PRODUCT_CATEGORY` LIKE ? "
      let executeQuery = mysql.format(queryStatement, [queryString,queryString,queryString]  );
      connection.query(executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
          Object.keys(result).forEach(function(key) {
           var row = result[key];
           total=total+1
           queryResult.push(row);
           productId=row['ID'];
           createdBy=row['CREATED_BY'];
           masterId=row['MASTER_ID'];
           productAvatar='';
           let _queryData=[masterId]
           let _total=0
           let _queryStatement="SELECT DISTINCT `product_media`.MEDIA_SOURCE FROM `product_media` WHERE `product_media`.MASTER_ID=? "
           let _executeQuery = mysql.format(_queryStatement,_queryData );
           connection.query(_executeQuery, function(error, result, fields) {
               if (!error){
                 manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
               } else{
                 console.log("with Media source: ",result)
                 productAvatar=_row['MEDIA_SOURCE']//.split("/Applications/XAMPP/xamppfiles/htdocs").join("")
                 manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
                   throw error;
               }
           });
           queryResult[indexObject]['MEDIA_SOURCE']= productAvatar;
           indexObject++;
         });
        }
      });
  },
  uploadProductMedia:async()=>{
      // :::::::::: ID	MASTER_ID	MEDIA_SOURCE	MEDIA_TYPE	DATE_	TIME_
      console.log('upload product media')
      let connection=manageProduct.db_Connection;
      let masterId=manageProduct.masterId;
      if(helperFunc.notEmpty(manageProduct.productMediaFiles) &&  manageProduct.productMediaFiles.length===undefined ){
        let file=manageProduct.productMediaFiles
        manageProduct.productMediaFiles=[]
        manageProduct.productMediaFiles.push(file)
      }
      for(let i=0; i< manageProduct.productMediaFiles.length; i++){
          let targetUploadFile=manageProduct.productMediaFiles[i];
          console.log("file length: ",manageProduct.productMediaFiles.length)
          // :::::::::: upload
          //let uploadFileResult=await uploadFile.init(targetUploadFile, "product-media");
          let uploadFileResult=await uploadToBucket.init(targetUploadFile, "product-media");
          console.log("upload file result:",uploadFileResult)
          // :::::::::  CREATE DATABASE RECORD
          let productId=manageProduct.productId
          let media_source = uploadFileResult.mediaSource;
          let media_type =  uploadFileResult.mediaType;
          let date_ = helperFunc.getTime('date');
          let time_ = helperFunc.getTime('time');
          let columnData =[ null,productId,masterId,media_source,media_type,date_,time_ ];
          let queryStatement = " INSERT INTO `product_media` VALUES (?,?,?,?,?,?,?) "
          let executeQuery = mysql.format(queryStatement, columnData );
          connection.query(executeQuery, function(error, result, fields) {
              if (!error){
                manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
              } else{
                manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
                  throw error;
              }
          });
      }
  },
  uploadProductMediaMore:async()=>{
      // :::::::::: ID	MASTER_ID	MEDIA_SOURCE	MEDIA_TYPE	DATE_	TIME_
      console.log('upload product media more')
      let connection=manageProduct.db_Connection;
      let masterId=manageProduct.masterId;
      if(helperFunc.notEmpty(manageProduct.productMoreMediaFiles) &&  manageProduct.productMoreMediaFiles.length===undefined ){
        let file=manageProduct.productMoreMediaFiles
        manageProduct.productMoreMediaFiles=[]
        manageProduct.productMoreMediaFiles.push(file)
      }
      for(let i=0; i<manageProduct.productMoreMediaFiles.length; i++){
          let targetUploadFile=manageProduct.productMoreMediaFiles[i]
          console.log("file length: ",manageProduct.productMoreMediaFiles.length)
          // ::::::::::::::::::::::::::::::::  file upload Object
          // :::::::::::::::::::::::::::::::: upload file and get results
          //let uploadFileResult=await uploadFile.init(targetUploadFile, "product-media");
          let uploadFileResult=await uploadToBucket.init(targetUploadFile, "product-media");
          console.log("upload file result:",uploadFileResult)
          // ::::::::::::::::::::::::::::::::  CREATE DATABASE RECORD
          let productId=manageProduct.productId
          let media_source = uploadFileResult.mediaSource;
          let media_type =  uploadFileResult.mediaType;
          let date_ = helperFunc.getTime('time');
          let time_ = helperFunc.getTime('date');
          let columnData =[ null,productId,masterId,media_source,media_type,date_,time_ ];
          let queryStatement = " INSERT INTO `product_more_media` VALUES (?,?,?,?,?,?,?) "
          let executeQuery = mysql.format(queryStatement, columnData );
          connection.query(executeQuery, function(error, result, fields) {
              if (!error){
                manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
              } else{
                manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
                  throw error;
              }
          });
      }
  },
  recordProductVariation:async()=>{
    return new Promise(async(resolve) => {
          console.log("record variation:: ",manageProduct.productVariations)
          // :::::::::::::::::::   ID	MASTER_ID   VARIATION_MASTER_ID	TITLE	IS_PRICE_VARIATION	VARIATION_TYPE	DATE_	TIME_
          for(let pvr=0; pvr< Object.keys(manageProduct.productVariations).length; pvr++){
              let productId=manageProduct.productId
              let productVariation=manageProduct.productVariations[pvr];
              let connection=manageProduct.db_Connection;
              let title=productVariation['title'];
              let hasPrice =productVariation['hasPrice'];
              let variationType=productVariation['category'];
              let masterId=manageProduct.masterId;
              let variationMasterId=helperFunc.generateUniqueId('prvar','mx_id');
              let date_ = helperFunc.getTime('date');
              let time_ = helperFunc.getTime('time');
              let options=productVariation['options'];
              // :::::::::::::::::
              let columnData =[ null,productId, masterId, variationMasterId,title,hasPrice,variationType,date_ ,time_ ];
              let queryStatement = " INSERT INTO `product_variation` VALUES (?,?,?,?,?,?,?,?,?) "
              let executeQuery = mysql.format(queryStatement, columnData );
              connection.query(executeQuery, function(error, result, fields) {
                  if (!error){
                    manageProduct.productVariationId=result.insertId
                    manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
                  } else{
                    manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
                      throw error;
                  }
              });
              if(variationType=="image-text"){
                //console.log("options: ",productVariation['options'],"files variation: ",manageProduct.pushFiles[pvr+"[]"])
                  if(  helperFunc.notEmpty(manageProduct.pushFiles[pvr+"[]"] ) ){
                      let imageOptions=manageProduct.pushFiles[pvr];
                      for(let opt=0; opt< manageProduct.pushFiles[pvr+"[]"].length; opt++){
                          // ::::::::::::::::::::::::::    time to extract image files
                          let varOps=productVariation['options'][opt];
                          let targetUploadFile=manageProduct.pushFiles[pvr+"[]"][opt]
                          mediaSource='';
                          // :::::::::: upload file Object
                          console.log("file length: ",manageProduct.productMoreMediaFiles.length)
                          // ::::::::::::::::::::::::::::::::  file upload Object
                          // :::::::::::::::::::::::::::::::: upload file and get results
                          let uploadFileResult=await uploadFile.init(targetUploadFile, "product-media");
                          // :::::::::  CREATE DATABASE RECORD
                          connection=manageProduct.db_Connection;
                          // :::::::::::::::::
                          let productVariationId=manageProduct.productVariationId
                          variationMasterId=variationMasterId;
                          title=varOps['title'];
                          let price=0
                          if(varOps['hasPrice']==1){
                            if(manageProduct.notEmpty(varOps['price'])){
                                price=varOps['price'];
                            }else{
                                price=0;
                            }
                          }
                          mediaSource=uploadFileResult.mediaSource;
                          // :::::::::::::::::
                          let columnData =[ null,productVariationId,variationMasterId,title,price,mediaSource ];
                          let queryStatement = " INSERT INTO `product_variation_options` VALUES (?,?,?,?,?,?) "
                          let executeQuery = mysql.format(queryStatement, columnData );
                          connection.query(executeQuery, function(error, result, fields) {
                              if (!error){
                                manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
                              } else{
                                manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
                                  throw error;
                              }
                          });
                      }
                  }
              }else if(variationType=="text"){
                  for(let opt=0; opt< productVariation['options'].length; opt++){
                      // :::::::::::::::::::::::::: 	 ID	VARIATION_MASTER_ID	TITLE	PRICE	MEDIA_SOURCE
                      varOps=productVariation['options'][opt];
                      // :::::::::  CREATE DATABASE RECORD
                      connection=manageProduct.db_Connection;
                      // :::::::::::::::::
                      let productVariationId=manageProduct.productVariationId
                      variationMasterId=variationMasterId;
                      title=varOps['title'];
                      let price=0;
                      if(varOps['hasPrice']==1){
                        if(manageProduct.notEmpty(varOps['price'])){
                            price=varOps['price'];
                        }else{
                            price=0;
                        }
                      }
                      mediaSource="";
                      // :::::::::::::::::
                      let columnData =[null,productVariationId, variationMasterId,title,price,mediaSource ];
                      let queryStatement = " INSERT INTO `product_variation_options` VALUES  (?,?,?,?,?,?) "
                      let executeQuery = mysql.format(queryStatement, columnData );
                      connection.query(executeQuery, function(error, result, fields) {
                          if (!error){
                            manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
                          } else{
                            manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
                              throw error;
                          }
                      });
                  }
              }
              // ::::::::::::::::::    get variation options
          }
          resolve({ });
      })
  },
  getNewProduct:async()=>{
    console.log('get new product')
      let productAttribute=[];
      let queryResult=[];
      let productId=0;
      let createdBy=0;
      let masterId='';
      let connection=manageProduct.db_Connection;
      let queryData=[]
      let total=0
      let queryStatement="SELECT DISTINCT * FROM products JOIN product_media ON product_media.PRODUCT_ID=products.ID WHERE products.ID=? GROUP BY products.ID ORDER BY products.ID ASC  "
      let executeQuery = mysql.format(queryStatement, [manageProduct.productId]  );
      //let executeQuery = mysql.format(queryStatement );


      connection.query(executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
          Object.keys(result).forEach(function(key) {
           var row = result[key];
           total=total+1
           queryResult=row;
           productId=row['ID'];
           createdBy=row['CREATED_BY'];
           masterId=row['MASTER_ID'];
         });

         /*
         let productAvatar='';
         let _queryData=[masterId]
         total=0
         _queryStatement="SELECT DISTINCT * FROM `product_media` WHERE `product_media`.MASTER_ID=? "
         _executeQuery = mysql.format(_queryStatement,_queryData );
         connection.query(_executeQuery, function(error,result,fields) {
           if (error){
             throw error;
           }else{
             let _row=result[0];
             //console.log("result: ",result,_row)
             productAvatar=_row['MEDIA_SOURCE'].split("/Applications/XAMPP/xamppfiles/htdocs").join("")
           }
         });
         queryResult['MEDIA_SOURCE']=productAvatar;
         */

        }
      });
      manageProduct.resultContent=queryResult;
  },
  getAllProductsBySeller:async()=>{
    console.log('products by seller: ')
      return new Promise(async(resolve) => {
        let queryResult=[];
        let productId=0;
        let createdBy=manageProduct.userId;
        let masterId='';
        let connection=manageProduct.db_Connection;
        let queryData=[createdBy]
        let total=0
        let queryStatement=  " SELECT DISTINCT products.*, product_media.MASTER_ID, product_media.MEDIA_SOURCE FROM products,product_media having products.CREATED_BY = ? AND products.MASTER_ID = product_media.MASTER_ID AND products.MASTER_ID IN (select DISTINCT product_media.MASTER_ID FROM product_media ) ORDER BY ID DESC  "
        let executeQuery = mysql.format(queryStatement, queryData  );
        let ProductIds=[]
        connection.query(executeQuery,async function(error,result,fields) {
          if (error){
            throw error;
          }else{
            let indexObject=0;
             console.log(result.length)
               Object.keys(result).forEach(async function(key) {
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
                  //console.log("query result: index obj: ",indexObject,queryResult)
                 }
             });
             //}
             //await getMediaSource()
           //console.log("query result length: ",queryResult.length,"index obje length: ",indexObject)

          }
          //console.log(queryResult)
          manageProduct.resultContent=queryResult;
          manageProduct.resultMessage='Created Successfully';
          manageProduct.resultCode=1;
          let result_=JSON.stringify( {"resultMessage":manageProduct.resultMessage,"resultCode":manageProduct.resultCode,"resultContent":manageProduct.resultContent} )
          //console.log(result_)
          manageProduct.result= result_
          resolve(result_);

        });

    })

  },
  getProductById:(productId)=>{
      let productAttribute=array();
      let queryResult='';
      let connection=manageProduct.db_Connection;
      let _queryData=[productId]
      let _total=0
      let _queryStatement="SELECT DISTINCT * FROM `products` WHERE `products`.ID=? ORDER BY ID DESC "
      let _executeQuery = mysql.format(_queryStatement,_queryData );
      connection.query(_executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
         let _row=result[0]
         manageProduct.resultContent=_row;
        }
      });
  },
  getProductDetailsByIdBuyer:()=>{
      // :::::::::::::: product result array
      let product={"productAttributes":[],"productMedia":[],"productMoreMedia":[],"productVariations":[]};
      let connection=manageProduct.db_Connection;
      let productId=manageProduct.payload['productId'];
      let queryData=[productId]
      let total=0
      let queryStatement="SELECT DISTINCT * FROM `products` WHERE `products`.ID=? ORDER BY ID DESC "
      let executeQuery = mysql.format(queryStatement,queryData );
      connection.query(executeQuery, function(error,result,fields) {
        if (error){
          throw error;
        }else{
          product['productAttributes']=result[0];
          masterId=row['MASTER_ID'];
          let _row=result[0]
           //manageProduct.resultContent=_row;
        }
      });

      // :::::::::: product media
      let queryData_=[masterId]
      let total_=0
      let queryStatement_="SELECT DISTINCT * FROM `product_media` WHERE `product_media`.MASTER_ID=?  "
      let executeQuery_ = mysql.format(queryStatement_,queryData_ );
      connection.query(executeQuery_, function(error,result,fields) {
        if (error){
          throw error;
        }else{
           Object.keys(result).forEach(async function(key) {
             result['MEDIA_SOURCE']= result['MEDIA_SOURCE'].split("/Applications/XAMPP/xamppfiles/htdocs").join("");
             product['productMedia'].push(result);

           });
        }
      });

      // :::::::::: product more media
      let queryData__=[masterId]
      let total__=0
      let queryStatement__="SELECT DISTINCT * FROM `product_more_media` WHERE `product_more_media`.MASTER_ID=?  "
      let executeQuery__ = mysql.format(queryStatement__,queryData_ );
      connection.query(executeQuery__, function(error,result,fields) {
        if (error){
          throw error;
        }else{
           Object.keys(result).forEach(async function(key) {
             result['MEDIA_SOURCE']= result['MEDIA_SOURCE'].split("/Applications/XAMPP/xamppfiles/htdocs").join("");
             product['productMedia'].push(result);

           });
        }
      });


      /*
      //::::::::: product variations
      $productVariations__targetTable="`product_variation`";
      $productVariations__queryStatements="SELECT DISTINCT * FROM $productVariations__targetTable WHERE $productVariations__targetTable.MASTER_ID='$masterId'  ";
      $productVariations__execQuery=mysqli_query($connection,$productVariations__queryStatements);
      $variationPosition=0;
      while($productVariations__row=mysqli_fetch_assoc($productVariations__execQuery)){
          // ::::::::::::: get product variations
          $variationMasterId=$productVariations__row['VARIATION_MASTER_ID'];
          $product['productVariations'][]=$productVariations__row;
          $productVariationOption__targetTable="`product_variation_options`";
          $productVariationOption__queryStatements="SELECT DISTINCT * FROM $productVariationOption__targetTable WHERE $productVariationOption__targetTable.VARIATION_MASTER_ID='$variationMasterId' ";
          $productVariationOption__execQuery=mysqli_query($connection,$productVariationOption__queryStatements);
          while($productVariationOption__row=mysqli_fetch_assoc($productVariationOption__execQuery)){
              // ::::::::::::; add variation options to variation through position
              $productVariationOption__row['MEDIA_SOURCE']=str_replace("/Applications/XAMPP/xamppfiles/htdocs","",$productVariationOption__row['MEDIA_SOURCE'] );
              $product['productVariations'][$variationPosition]['options'][]=$productVariationOption__row;
          }
          $variationPosition+=1;
      }
      //echo json_encode(array("resultMessage"=>"success","resultCode"=>1,"resultContent"=>$product) );
      let result=JSON.stringify({"resultMessage":"success","resultCode":1,"resultContent":product })
      manageProduct.resultContent=result
      console.log(result)
      */

  },
  createProduct:async()=>{
      manageProduct.masterId=helperFunc.generateUniqueId('prdid','mx_idpr');
      await manageProduct.recordProductBasicInfo();
      if( manageProduct.pushFiles['productMedia[]']!==''  ){
          await manageProduct.uploadProductMedia();
      }
      if( manageProduct.pushFiles['productMoreMedia[]']!=='' ){
          await manageProduct.uploadProductMediaMore();
      }
      await manageProduct.recordProductVariation();
      await manageProduct.getNewProduct();
      // ::::::::::::::: return final create product result
      manageProduct.resultMessage='Created Successfully';
      manageProduct.resultCode=1;
      let result=JSON.stringify({"resultMessage":manageProduct.resultMessage,"resultCode":manageProduct.resultCode,"resultContent":manageProduct.resultContent} );
      console.log("create p:",result)
      //  echo json_encode(array("resultMessage"=>manageProduct.resultMessage,"resultCode"=>manageProduct.resultCode,"resultContent"=>manageProduct.resultContent) );
  },
  updateProduct:()=>{

  },
  deleteProduct:()=>{

  }

}
module.exports = manageProduct;

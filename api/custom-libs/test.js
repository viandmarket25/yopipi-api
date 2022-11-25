
let mysql = require('mysql');
port = process.env.PORT || 4205;
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'yopipi_db',
    insecureAuth: true
});
connection.connect();


/*
  let queryString='%i%'
  let total=0
  let queryStatement="SELECT * FROM `products` WHERE `TITLE` LIKE ? OR `DESCRIPTION` LIKE ? OR `PRODUCT_CATEGORY` LIKE ? "
  let executeQuery = mysql.format(queryStatement, [queryString,queryString,queryString]  );
  connection.query(executeQuery, function(error,result,fields) {
    if (error){
      throw error;
    }else{
      Object.keys(result).forEach(function(key) {
       var row = result[key];

       console.log(row['ID'])

       total=total+1
       console.log(row)
       console.log(total)
     });
    }
  });

*/



/*

  let masterId='mid'
  let media_source='medi'
  let media_type='medt'
  let date_='dt'
  let time_='tm'


  let columnData =[ null,masterId,media_source,media_type,date_,time_ ];
  let total=0
  let queryStatement = " INSERT INTO `product_more_media` VALUES (?,?,?,?,?,?) "
  let executeQuery = mysql.format(queryStatement, columnData );
  connection.query(executeQuery, function(error, result, fields) {
      if (!error){
        //manageProduct.result= JSON.stringify({"result_code":1,"result_message":"success","result_content":result });
      } else{
        //manageProduct.result= JSON.stringify({"result_code":1,"result_message":"failed"});
          throw error;
      }
        // if any error while executing above query, throw error
  });
  */

  let productAttribute=[];
  let queryResult=[];
  let productId=0;
  let createdBy=0;
  let masterId='mast_idx61b27cc9c2ab003397029609Dec20211112452541mx_id';
  //let connection=manageProduct.db_Connection;
  let queryData=[]

  queryData=[masterId]
  let total=0
  let queryStatement="SELECT DISTINCT *   FROM `product_media` WHERE `product_media`.MASTER_ID=? "
  let executeQuery = mysql.format(queryStatement,queryData );
  connection.query(executeQuery, function(error,result,fields) {
    if (error){
      throw error;
    }else{
     let row=result[0]
     console.log(result,result.length,row)
    }
  });

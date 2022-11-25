let baseUrl='/Users/mac/Documents/yopipi-api/api/'
let formidable = require('formidable');
const multer = require('multer');
const upload = multer();
let { wrapAsync } = require('@rimiti/express-async');
const cors = require('cors');
let connection = require(baseUrl+'custom-libs/dbConnection');
let userManager = require(baseUrl+'custom-libs/getUser');
let uploadFile = require(baseUrl+'custom-libs/uploadFile');
let signupUser = require(baseUrl+'custom-libs/signupUser');
let loginUser = require(baseUrl+'custom-libs/loginUser');
let listItem = require(baseUrl+'custom-libs/listItem');
let productManager = require(baseUrl+'product-seller/productManager');
let productSearch = require(baseUrl+'product-buyer/productSearch');
let userFriendMessages=require(baseUrl+'user/messages/user-friend-messages');
let userContacts=require(baseUrl+'user/messages/user-contacts');
let userRecentMessages=require(baseUrl+'user/messages/user-recent-messages');

let authorizationMiddleWare = require(baseUrl + 'custom-libs/userAuthorization');


const formData = formidable({ multiples: true });
let http = require('http'); // Import Node.js core module
const serverPort=3000;
let routeFunctions={
    routes:{
      "NOT_FOUND":async (serviceParams) => {
           // :::::::::::::; test api
               let resultData
                return new Promise(async(resolve) => {
                   serviceParams.result.write("Invalid Resource...");
                   serviceParams.result.end()
                   console.log("Invalid Resource...")
                   resolve("Invalid Resource...");

                })
           },
           "NOT_AUTHORIZED":async (serviceParams) => {
                // :::::::::::::; test api
                    let resultData
                     return new Promise(async(resolve) => {
                        serviceParams.result.write("Unauthorized Access...");
                        serviceParams.result.end()
                        console.log("Unauthorized Access...")
                        resolve("Unauthorized Access...");

                     })
                },
        "GET":[
            // ::::::::::: get products
            {
                "url":"/products",
                "method":async (serviceParams) => {
                     console.log('get product:',serviceParams.request)
                     let resultData
                         return new Promise(async(resolve) => {
                             resultData = await  routeFunctions.readJsonFile("json-db.json").catch((error)=>{
                               // :::::::::::::::::::::::::::::
                             }).then((resultData) =>{
                                resultData=resultData['products']
                                let update=[]
                                for(let i=0; i<resultData.length; i++){
                                    let p={
                                        "title":resultData[i].title,
                                        "picture":resultData[i].images['large'],
                                        "description":resultData[i].description[0],
                                        "publisher":resultData[i].publisher,
                                    }
                                    update.push(p)
                                }
                                resultData=update
                                console.log("response timeout over, send result");
                                resultData = JSON.stringify(resultData)
                                console.log("result data:",resultData,"length: ",resultData.length)
                                serviceParams.result.write(resultData);
                                serviceParams.result.end();
                                resolve(resultData);
                             }).catch((error)=>{
                             })
                         });
                }
             },
             {
                "url":"/",
                "method":async (serviceParams) => {
                // :::::::::::::; test api
                    let resultData
                     return new Promise(async(resolve) => {
                        serviceParams.result.write("test hello world!");
                        serviceParams.result.end()
                        console.log("test hello world!")
                        resolve("test hello world!");

                     })
                }
            },
        ],
        "POST":[
          {
              "url":"/login-user",
              "method": (serviceParams) => {
                      try {
                          // ::: try catch and process in comning requests
                          let resultData
                          let dataParameters = {}
                              // :::::::: get payload data
                          formData.parse(serviceParams.request, async(error, fields, files) => {
                              console.log("fields:: ", fields, "files:: ", files)
                              dataParameters = JSON.parse(fields.payload)
                              resultData = await loginUser.init('login-user', dataParameters);
                              setTimeout(() => {
                                  console.log("response timeout over, send result");
                                  resultData = JSON.stringify(resultData)
                                  console.log(resultData)
                                  serviceParams.result.write(resultData);
                                  serviceParams.result.end();
                              }, 1400)
                          })
                      } catch (error) {
                          console.debug(error)
                      }
              }
           },
           {
               "url":"/create-user/",
               "method": (serviceParams) => {
                       try {
                           // ::: try catch and process in comning requests
                           console.log('create user:')
                           let resultData
                           formData.parse(request, async(error, fields, files) => {
                               console.log("request body:: ", fields)
                               console.log(fields, files)
                               let dataParameters = JSON.parse(fields.payload)
                               resultData = await signupUser.init('create-user', dataParameters);
                               setTimeout(() => {
                                   console.log("response timeout over, send result");
                                   resultData = JSON.stringify(resultData)
                                   console.log(resultData)
                                   result.write(resultData);
                                   result.end();
                               }, 1400)
                           })
                       } catch (error) {
                           console.debug(error)
                       }
               }
            },
            {
                "url":"/product-manager/",
                "method":async (serviceParams) => {
                            try {
                                // ::: try catch and process in comning requests
                                console.log('manage product:')
                                let resultData
                                formData.parse(serviceParams.request, async(error, fields, files) => {
                                    let dataParameters = JSON.parse(fields.payload)
                                    return new Promise(async(resolve) => {
                                        resultData =  await productManager.init(fields['auth_crd'],fields['action'],files,dataParameters).catch((error)=>{
                                          // ::::::::
                                        }).then((resultData) =>{
                                            console.log("response timeout over, send result");
                                            resultData = JSON.stringify(resultData)
                                            console.log("result data:",resultData)
                                            serviceParams.result.write(resultData);
                                            serviceParams.result.end();
                                            resolve(resultData);
                                        });
                                    });
                                })
                            } catch (error) {
                                console.debug(error)
                            }
                    }
             },
             {
                 "url":"/search-product/",
                 "method":async (serviceParams) => {
                             try {
                                 // ::: try catch and process in comning requests
                                 console.log('search product:')
                                 let resultData
                                 formData.parse(serviceParams.request, async(error, fields, files) => {
                                     let dataParameters = JSON.parse(fields.payload)
                                     return new Promise(async(resolve) => {
                                         resultData =  await productSearch.init(fields['auth_crd'],fields['action'],files,dataParameters).catch((error)=>{
                                           // ::::::::
                                         }).then((resultData) =>{
                                            console.log("response timeout over, send result");
                                            resultData = JSON.stringify(resultData)
                                            console.log("result data:",resultData)
                                            serviceParams.result.write(resultData);
                                            serviceParams.result.end();
                                            resolve(resultData);
                                         });
                                     });
                                 })
                             } catch (error) {
                                 console.debug0(error)
                             }
                     }
              },
              {
                  "url":"/product-info/",
                  "method":async (serviceParams) => {
                              try {
                                  // ::: try catch and process in comning requests
                                  console.log('product info:')
                                  let resultData
                                  formData.parse(serviceParams.request, async(error, fields, files) => {
                                      let dataParameters = JSON.parse(fields.payload)
                                      return new Promise(async(resolve) => {
                                          resultData =  await productSearch.init(fields['auth_crd'],fields['action'],files,dataParameters).catch((error)=>{
                                            // ::::::::
                                          }).then((resultData) =>{
                                             console.log("response timeout over, send result");
                                             resultData = JSON.stringify(resultData)
                                             console.log("result data:",resultData)
                                             serviceParams.result.write(resultData);
                                             serviceParams.result.end();
                                             resolve(resultData);
                                          });
                                      });
                                  })
                              } catch (error) {
                                  console.debug(error)
                              }
                      }
               },
               {
                  "url":"/user-friend-messages",
                  "method":async (serviceParams) => {
                    try {
                        // ::: try catch and process in comning requests
                        let resultData
                        let dataParameters = {}
                            // :::::::: get payload data
                        formData.parse(serviceParams.request, async(error, fields, files) => {
                          let dataParameters = JSON.parse(fields.payload)
                          return new Promise(async(resolve) => {
                              resultData =  await userFriendMessages.init(fields['auth_crd'],fields['action'],files,dataParameters).catch((error)=>{
                                // ::::::::
                              }).then((resultData) =>{
                                 console.log("response timeout over, send result");
                                 resultData = JSON.stringify(resultData)
                                 //console.log("result data:",resultData)
                                 serviceParams.result.write(resultData);
                                 serviceParams.result.end();
                                 resolve(resultData);
                              });
                          });
                          console.log("fields:: ", fields, "files:: ", files)
                          dataParameters = JSON.parse(fields.payload)
                        })
                    } catch (error) {
                        console.debug(error)
                    }
                  }
              },
              {
                 "url":"/user-contacts",
                 "method":async (serviceParams) => {
                   try {
                       // ::: try catch and process in comning requests
                       let resultData
                       let dataParameters = {}
                           // :::::::: get payload data
                       formData.parse(serviceParams.request, async(error, fields, files) => {
                         let dataParameters = JSON.parse(fields.payload)
                         return new Promise(async(resolve) => {
                             resultData =  await userContacts.init(fields['auth_crd'],fields['action'],files,dataParameters).catch((error)=>{
                               // ::::::::
                             }).then((resultData) =>{
                                console.log("response timeout over, send result");
                                resultData = JSON.stringify(resultData)
                                //console.log("result data:",resultData)
                                serviceParams.result.write(resultData);
                                serviceParams.result.end();
                                resolve(resultData);
                             });
                         });
                         console.log("fields:: ", fields, "files:: ", files)
                         dataParameters = JSON.parse(fields.payload)
                       })
                   } catch (error) {
                       console.debug(error)
                   }
                 }
             },
             {
                "url":"/user-recent-messages",
                "method":async(serviceParams) => {
                  try {
                      // ::: try catch and process in comning requests
                      let resultData
                      let dataParameters = {}
                          // :::::::: get payload data
                      formData.parse(serviceParams.request, async(error, fields, files) => {
                        let dataParameters = JSON.parse(fields.payload)
                        return new Promise(async(resolve) => {
                            resultData =  await userRecentMessages.init(fields['auth_crd'],fields['action'],files,dataParameters).catch((error)=>{
                              // ::::::::
                            }).then((resultData) =>{
                               console.log("response timeout over, send result");
                               resultData = JSON.stringify(resultData)
                               //console.log("result data:",resultData)
                               serviceParams.result.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                               serviceParams.result.write(resultData);
                               serviceParams.result.end();
                               resolve(resultData);
                            });
                        });
                        console.log("fields:: ", fields, "files:: ", files)
                        dataParameters = JSON.parse(fields.payload)
                      })
                  } catch (error) {
                      console.debug(error)
                  }
                }
            },
        ],
        "PUT":[

        ],
        "DELETE":[

        ],
    },
    readJsonFile:(file)=>{
       return new Promise(async(resolve) => {
            fs.readFile( __dirname + "/" +file, 'utf8', function (err, data) {
              data = JSON.parse( data );
              resolve( data )
            })
       });
    },
}
let requestHandler={
    // :::::::::::::::: iterate all routes related to a request method
    // :::::::::::::::: and then call related function
    handle:(serviceParams,requestMethod)=>{
    // :::::::::::::: example if request method == GET
        let validRoute = false;
        // ::::::::::::: authorize users
        // authorizationMiddleWare.init();
        /*
        if (authorizationMiddleWare.init()) {
            for(let i=0; i<routeFunctions.routes[requestMethod].length; i++){
                if(serviceParams.request.url===routeFunctions.routes[requestMethod][i]['url'] ){
                    validRoute=true
                    // :::::::::::::::::: authentication middle-ware used to permit user here
                    routeFunctions.routes[requestMethod][i]['method'](serviceParams);
                }
            }
            // ::::::::::: if not valid resource was found show error
            validRoute==false?routeFunctions.routes["NOT_FOUND"](serviceParams):false;
        } else { 
            validRoute==false?routeFunctions.routes["NOT_AUTHORIZED"](serviceParams):false;
        }

*/
        // :::::::::::::::: this part will be removed
          for(let i=0; i<routeFunctions.routes[requestMethod].length; i++){
                if(serviceParams.request.url===routeFunctions.routes[requestMethod][i]['url'] ){
                    validRoute=true
                    // :::::::::::::::::: authentication middle-ware used to permit user here
                    routeFunctions.routes[requestMethod][i]['method'](serviceParams);
                }
            }
            // ::::::::::: if not valid resource was found show error
            validRoute==false?routeFunctions.routes["NOT_FOUND"](serviceParams):false;


       
    }
}
try {
    let server = http.createServer(async(request, result) => {
      //console.log(request)
        // :::::::: create web server
        result.setHeader('Access-Control-Allow-Origin', '*');
        result.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PUT');
        result.setHeader('Access-Control-Max-Age', 259208800); // 30 days
        result.setHeader('Pragma', 'no-cache');
        result.setHeader('Cache-Control', 'no-store,no-cahce');
        result.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type,Authorization, Access-Control-Request-Method, Access-Control-Request-Headers, Pragma");
        // ::::::::: handle post requests
        let serviceParams={"request":request,"result":result}
        if(request.method === "POST"){
           requestHandler.handle(serviceParams,"POST")
        }
        // ::::::::: handle get requests
        if(request.method === "GET"){
           requestHandler.handle(serviceParams,"GET")
        }
        // :::::::::: handle put requests
        if(request.method === "PUT"){
           requestHandler.handle(serviceParams,"PUT")
        }
        if(request.method === "DELETE"){
           requestHandler.handle(serviceParams,"DELETE")
        }
        //result.end(request.url);
    });
    // :::::: 192.168.1.14 , 192.168.1.3
    server.listen(serverPort,'192.168.1.3'); //6 - listen for any incoming requests
    console.log('Node.js web server at port '+serverPort+' is running..')
} catch (error) {
    console.log("error: ", error)
}

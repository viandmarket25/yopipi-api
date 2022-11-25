

const WebSocket = require('/Users/mac/node_modules/ws');
for(var i=0; i<5000; i++){
  const ws = new WebSocket('ws://localhost:8090');
  
    async function asyncConnection() {
        let promise = new Promise((res, rej) => {
            const ws = new WebSocket('ws://localhost:8090');
            const userID='pingPong-user'+i;
            var receiver='pancake';
            ws.onopen = function() {
                //console.log("connected"+'pingPong-user'+i);
            };
            ws.onmessage = function(message) {
              console.log(message);
              let receivedMessage=JSON.parse(message.data);
              console.log(receivedMessage);
              if(receivedMessage.signalType=='ack'){
                ws.send(JSON.stringify({signalType:'recv_ack',userID:userID,connectionID:receivedMessage.connectionID,value3:''}) );
              }
              if(receivedMessage.signalType=='msg'){
                console.log("message type= "+receivedMessage.signalType);
                console.log("message content= "+receivedMessage.messageContent)
              
              }
        
            };

            setTimeout(() => res(1), 300)
        });


        // wait until the promise returns us a value
        let result = await promise; 
    
        // "Now it's done!"
        //alert(result); 
        }
    //};
    //asyncConnection();

    

/*
  

    */

}
     
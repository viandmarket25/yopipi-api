const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8090
});
let signalTypes = {
    connectionRequest: 0,
    textMessage: 1,
    eventMessage: 2,
    notificationMessage: 3,
    imageMessage: 4,
    videoMessage: 5,
}
let connectionParameters = {
    signalType: '',
}
let sockets = [];
let connectedAgents = [];
let faceRecognitionSocketClient = [];

function addUserConnection(socketConnection, userAddress) {
    if (connectedAgents.length > 0) {
        for (var _agent = 0; _agent < connectedAgents.length; _agent++) {
            if (userAddress != connectedAgents[_agent]) {
                sockets.push(socketConnection);
                connectedAgents.push(userAddress);
            }
        }
    } else {
        sockets.push(socketConnection);
        connectedAgents.push(userAddress);
    }
}
server.on('connection', function connection(socket, requestDetail) {
    sockets.push(socket);
    let connectionID = socket._socket.address()['address'];
    connectedAgents.push(connectionID);
    socket.send(JSON.stringify({ signalType: 'ack', connectionID: connectionID }));
    //addUserConnection(socket,socket._socket.address()['address']);
    console.log("new connection! " + " Total connections: " + sockets.length);
    socket.on('message', function(message) {
        console.log(message)
            /****
             * Perform connection handshake, if user has aknowledged the connection
             * he sends back his real id, then with the real id, he can receive messages
             * ***/
        let receivedMessage = JSON.parse(message);
        //console.log(receivedMessage)
        if (receivedMessage.signalType == 'recv_ack') {
            console.log(connectedAgents);
            /****
             * Store user's real identity in connected agents array
             * ***/
            let indexUserID = connectedAgents.indexOf(receivedMessage.connectionID);
            console.log("index user id: " + indexUserID);
            connectedAgents[indexUserID] = receivedMessage.userID;
            /***
             * Add our face recognition socket client to the connection
             * search the sockets for the recognition server, push it to [faceRecognitionSocketClient]
             * ***/
            if (receivedMessage.workerClientID == 'sksk') {
                let indexRecognitionClientID = connectedAgents.indexOf(receivedMessage.connectionID);
                console.log("new recognition client: " + indexRecognitionClientID);
                //-----remove the recognition Client from chat message processing clients
                //connectedAgents[indexRecognitionClientID]=receivedMessage.userID;
                faceRecognitionSocketClient.push(indexRecognitionClientID);
                console.log("total recognition clients: " + faceRecognitionSocketClient.length);

            }
        } else {
            console.log(connectedAgents);
            /***
             * When new message arrives from client, if its msg type, just get the content and send it to the 
             * connected clients who need to recieve it
             * JSON encode message and push to clients
             * ***/

            let jsonMessage

            jsonMessage = JSON.stringify(receivedMessage)
            sockets.forEach(eachMessageAgent => eachMessageAgent.send(jsonMessage));
        }
        console.log("new message: " + JSON.stringify(message));

    });
    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
        closingSocketIp = socket._socket.address()['address'];
        connectedAgents.splice(connectedAgents.indexOf(closingSocketIp));
        console.log(closingSocketIp);




    });
});
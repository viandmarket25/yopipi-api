const WebSocket = require('/Users/mac/node_modules/ws');
 
/*
const wss = new WebSocket.Server({ port: 8080 });
 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
*/

let clients = [
    new WebSocket('ws://localhost:8090'),
    new WebSocket('ws://localhost:8090')
  ];
  
  clients.map(client => {
    client.on('message', msg => console.log(msg));
  });
  
  // Wait for the client to connect using async/await
  await new Promise(resolve => clients[0].once('open', resolve));
  
  // Prints "Hello!" twice, once for each client.
  clients[0].send('Hello!');

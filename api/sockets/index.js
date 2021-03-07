const webSocketServer = require('websocket').server;
const http = require('http');

// Generates unique ID for every new connection
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

// I'm maintaining all active connections in this object
const CLIENTS = {};
// I'm maintaining all active USERS in this object
const USERS = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];

const MSN = [];


const sendMessage = (json) => {
  // We are sending the current data to all connected CLIENTS
  Object.keys(CLIENTS).map((client) => {
    CLIENTS[client].sendUTF(json);
  });
}

const typesDef = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange"
}

exports.server = app => {
    // Spinning the http server and the websocket server.
    const server = http.createServer(app);
    const wsServer = new webSocketServer({
        httpServer: server
    });


    wsServer.on('request', request => {
        var userID = getUniqueID();
        console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
        // You can rewrite this part of the code to accept only the requests from allowed origin

        const connection = request.accept(null, request.origin);
        CLIENTS[userID] = connection;
        console.log('connected socket client: ' + userID + ' in ' + Object.getOwnPropertyNames(CLIENTS));

        connection.on('message', message => {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
            }
            // console.log('message cliente', message);
            // if (message.type === 'utf8') {
            //     // console.log(message, 'IF', JSON.parse(message.utf8Data));
            //     const dataFromClient = JSON.parse(message.utf8Data);
            //     const json = { type: 'OK' };
            //     if (dataFromClient.type === typesDef.USER_EVENT) {
            //         USERS[userID] = dataFromClient;
            //         userActivity.push(`${dataFromClient.username} joined to edit the document`);
            //         json.data = { USERS, userActivity };
            //     } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
            //         editorContent = dataFromClient.content;
            //         json.data = { editorContent, userActivity };
            //     }
            //     console.log(json);
            //     // sendMessage(JSON.stringify(json));
            // }
        });

        // user disconnected
        connection.on('close', connection => {
            console.log((new Date()) + " Peer " + userID + " disconnected.");
            //const json = { type: typesDef.USER_EVENT };
            //userActivity.push(`${USERS[userID].username} left the document`);
            //json.data = { USERS, userActivity };
            delete CLIENTS[userID];
            delete USERS[userID];
            //sendMessage(JSON.stringify(json));
        });
    });

    return server;
};

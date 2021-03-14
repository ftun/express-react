const webSocketServer = require('websocket').server;
const http = require('http');

// Generates unique ID for every new connection
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

const getCurrentDate = (current, useTime = true) => {
	let hoy = current !== undefined ? new Date(current) : new Date();
	let dd = hoy.getDate();
	let mm = hoy.getMonth() + 1; //hoy es 0!
	let yyyy = hoy.getFullYear();

	dd = (dd < 10 ? ('0' + dd) : dd);
	mm = (mm < 10 ? ('0' + mm) : mm);

	let date =  yyyy + '-' + mm + '-' + dd;

	if(useTime) {
		let hour = hoy.getHours();
		let minute = hoy.getMinutes();
		let second = hoy.getSeconds();
		hour = (hour.length == 1 ? ('0' + hour) : hour);
		minute = (minute.length == 1 ? ('0' + minute) : minute);
		second = (second.length == 1 ? ('0' + second) : second);
		date += ' '+ hour + ':' + minute + ':' + second;
	}

	return date;
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
            console.log('message', message);
            if (message.type === 'utf8') {
                const json = JSON.parse(message.utf8Data);
                json.id = userID;
                json.date = getCurrentDate();
                if (json.type === 'JOIN') {
                    USERS[userID] = { username : json.username };
                    json.body = 'joined!';
                    sendMessage(JSON.stringify(json));
                } else if (json.type === 'MSN') {
                    sendMessage(JSON.stringify(json));
                }
            }
            // else if (message.type === 'binary') {
            //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //     connection.sendBytes(message.binaryData);
            // }
        });

        // user disconnected
        connection.on('close', connection => {
            console.log((new Date()) + " Peer " + userID + " disconnected.");
            const json = { type: 'EXIT', username : USERS[userID].username, body : 'Exited', date : getCurrentDate() };
            delete CLIENTS[userID];
            delete USERS[userID];
            sendMessage(JSON.stringify(json));
        });
    });

    return server;
};

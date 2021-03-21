// const webSocketServer = require('websocket').server;
const socketIO = require('socket.io');
const http = require('http');
const sharedsession = require("express-socket.io-session");

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

// este array va a ser nuestra base de datos
// no es una base de datos de verdad, pero para el ejemplo nos sirve
const messages = []

exports.server = (app, session) => {
    // Spinning the http server and the websocket server.
    const server = http.createServer(app);
    const io = socketIO(server);
    io.use(sharedsession(session));

    io.on('connection', socket => {
        // sessionUser = socket.handshake.session.user;
        // console.log('User connected', socket.id);
        let sessionUser = socket.handshake.session.user;
        CLIENTS[socket.id] = sessionUser;
        // enviamos el mensaje al cliente que se acaba de conectar
        socket.emit('chat', { username : sessionUser.user, body : 'Hello!', type: "JOIN" });
        // socket.broadcast.emit('User connected');
        socket.on('chat', data => {
            let currentUser = CLIENTS[socket.id];
            data.username = currentUser.user;
            // guardamos el mensaje en nuestra "DB"
            messages.push(data);
            // enviamos el mensaje a todos los sockets clientes
            io.sockets.emit('chat', data);
            // enviamos el mensaje a todos los sockets clientes menos a quién los envió
            // socket.broadcast.emit("chat", data);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            // socket.broadcast.emit('message');
        });
    });

    return server;
};

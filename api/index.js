require('./config/config');

var express = require('express');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
// const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const serverIO = require('./sockets/index').server;
const app = express();

// const conn = require('./conecction');

const store = new MongoDBStore({
    uri: process.env.URLDB,
    collection: 'mySessions',
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000
    }
}, error => {
    if (error) throw error;
    console.log("Base de datos online");
});

// Catch errors
store.on('error', error => {
    console.log('Store::Error => ', error);
});

app.use(require('express-session')({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {

    // console.log('Time:', Date.now());
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const port = process.env.PORT;
const sendFile = path.join(__dirname, '../dist/index.html')

app.use('/public', express.static('../public'));
app.set('port', port);

// console.log(process.env.NODE_ENV)

app.use('/api', require('./routes/index'));

if (process.env.NODE_ENV === 'production') {
    // app.set('trust proxy', 1) // trust first proxy
    // sess.cookie.secure = true // serve secure cookies

    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        res.sendFile(sendFile);
    });
} else {
    const webpack = require('webpack');
    const config = require('../webpack.config.js');
    const compiler = webpack(config);
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const middleware = webpackMiddleware(compiler);

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('*', (req, res) => {
        res.write(middleware.fileSystem.readFileSync(sendFile));
        res.end();
    });
}

// Spinning the http server and the websocket server.
const server = serverIO(app);
server.listen(port, () => {
    console.log(`Env: ${process.env.NODE_ENV} App listening at http://localhost:${port}`)
});

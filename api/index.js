require('./config/config');

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
// const MongoStore = require('connect-mongo')(session);
// var MongoDBStore = require('connect-mongodb-session')(session);
// const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const serverIO = require('./sockets/index').server;
const app = express();

const port = process.env.PORT;
const sendFile = path.join(__dirname, '../dist/index.html');


mongoose.connect(process.env.URLDB,{useNewUrlParser:true});
const conn = mongoose.connection;
conn.on('connected',() => {
    console.log('MongoDB connected')
});
conn.on('error', err => {
    if (err) console.log('Store::Error => ', error);
});


// const conn = require('./conecction');
//
// const store = new MongoDBStore({
//     uri: process.env.URLDB,
//     // collection: 'test',
//     connectionOptions: {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         serverSelectionTimeoutMS: 10000
//     }
// }, error => {
//     if (error) throw error;
//     console.log("Base de datos online");
// });
//
// // Catch errors
// store.on('error', error => {
//     console.log('Store::Error => ', error);
// });

app.use(require('express-session')({
    secret: process.env.SESSION_SECRET,
    // cookie: {
    //     maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
    // },
    // store: store,
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    if (req.session) return next();

    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/public', express.static('../public'));
app.set('port', port);
app.use('/api', require('./routes/index'));

if (process.env.NODE_ENV === 'production') {
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

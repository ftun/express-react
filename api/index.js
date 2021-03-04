const express = require('express');
const path = require('path');
const serverIO = require('./sockets/index').server;

const app = express();
const port = process.env.PORT || 3000;
const sendFile = path.join(__dirname, '../dist/index.html')

app.use('/public', express.static('../public'));
app.set('port', port);

// console.log(process.env.NODE_ENV)

app.get('/api', (req, res) => {
  res.status(200).json({ foo: 'bar', bar: 'foo' });
});

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
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    let {body} = req;
    console.log(body);
    res.send({msn : 'Ok'})
});
// app.use(require('./login'));
// app.use(require('./register'));

module.exports = app;

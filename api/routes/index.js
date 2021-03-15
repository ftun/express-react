const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('./../models/Usuario');
const app = express();

app.get('/', (req, res) => {
    let {body} = req;
    console.log(body);
    res.send({msn : 'Ok'})
});

app.post('/SignIn', (req, res) => {
    let body = req.body;

    let { user, email, password } = body;
    let usuario = new Usuario({
      user,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    usuario.save((err, usuarioDB) => {
        console.log(err, 'err ', usuarioDB);
      if (err) {
          return res.status(400).json({
              ok: false,
              err,
          });
      }

      res.json({
          ok: true,
          usuario: usuarioDB
      });

    });
});

// app.use(require('./login'));
// app.use(require('./register'));

module.exports = app;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('./../models/Usuario');
const app = express();

// app.get('/', (req, res) => {
//     console.info( req.session);
//
//     res.json({ msn : 'Hola'});
// });

app.get('/isAuthenticated', (req, res) => {
    let session = req.session;
    if (!session.user) return res.status(403).json({ ok: false });

    return Usuario.findOne({ user: session.user.user }, (erro, usuarioDB) => {
        if (erro) return res.status(500).json({ ok: false });
        if (!usuarioDB) return res.status(403).json({ ok: false });
        return res.json({ ok: true, user : usuarioDB.user, email: usuarioDB.email});
    });
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


app.post('/logIn', (req, res) => {
    let body = req.body;
    Usuario.findOne({ user: body.user }, (erro, usuarioDB) => {
        if (erro) {
            return res.status(500).json({
                ok: false,
                err: erro
            })
        }

        // Verifica que exista un usuario con el mail escrita por el usuario.
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }

        // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }

        // Genera el token de autenticación
        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED_AUTENTICACION, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        })

        req.session.user = usuarioDB;
        req.session.save(err => {
            if (err) console.error(err);
            console.info('session.save');
        });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        })

    });
});

// Logout endpoint
app.get('/logOut', function (req, res) {
    req.session.destroy(err => {
        if (err) console.error(err);
        console.info('session.destroy');
    });
    res.json({
        ok: true,
    });
});

module.exports = app;

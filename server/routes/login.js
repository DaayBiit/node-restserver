const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const app = express();

app.post('/api/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña inconrrecto'
                }
            })
        }

        if (bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña inconrrecto'
                }
            })
        }

    let token = jwt.sign({
        user: userDB
    }, process.env.SEED, {expiresIn: 60 * 60});

        res.json({
            ok: true,
            user: userDB,
            token
        })

    })

})
module.exports = app;
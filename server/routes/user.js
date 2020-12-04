const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

const { verificarToken } = require('../middlewares/authentication');


app.get('/api/user/:id', verificarToken , (req, res) => {

   
    User.findById(req.params.id)
        .exec((err, userDB) => {
            if (err) {
               // console.log("Error:::", err);
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!userDB || userDB === null) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                user: userDB
            })
            
        })


});

app.get('/api/user', verificarToken , (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({status: true}, 'name email google role status')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {

            if (err) {
                console.log("Error:::", err);
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.countDocuments({status: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    quality: conteo
                })
            })
        })


});

app.post('/api/user', verificarToken , function (req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            console.log("user.save - Error:::", err);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    });
});

app.put('/api/user/:id', verificarToken , function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'role', 'status', 'google']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            console.log("Error:::", err);
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
});

app.patch('/api/user/:id', verificarToken, function (req, res) {
    let id = req.params.id;
    let cambioEstado = {
        status: false
    }
    User.findByIdAndUpdate(id, cambioEstado, { new: true}, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (userDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            userStatus: userDB.status
        })

    })
})

app.delete('/api/user/:id', verificarToken, function(req, res) {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUserDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (deletedUserDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: 'Usuario Eliminado'
        })

    })

});


module.exports = app;
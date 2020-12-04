const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/api/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
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

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña inconrrecto'
                }
            })
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        })

    })

});


//Configuracion de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log('PAYLOAD:::', payload);
    return {
        name: payload.name,
        email: payload.email,
        google: true
    }
}

app.post('/api/google/oauth', async (req, res) => {

   
    let token = req.body.token;

    console.log('TOKEN:::', token);

    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                googleUserErr: err
            });
        });

    //console.log("GoogleUser - Verificar:::", googleUser);

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        console.log('User.findOne :::', userDB);
        if (err) {
            console.log("user.findone - Error:::", err);
            return res.status(500).json({
                ok: false,
                findOneErr: err
            });
        };

        if (userDB) {
            console.log("user.findone - userDB:::", userDB);
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe utilizar autenticacion interna'
                    
                });
            } else {
                let token = jwt.sign({user: userDB}, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                console.log('NEW TOKEN:::', token);
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
             }
        } else {
            // si el usuario no existe en nuestra base de datos
            console.log("ELSE el usuario no existe en nuestra base de datos");
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.google = true;
            user.password = 'google';

            user.save((err, userDB) => {
                if (err) {
                    console.log("user.save - Error:::", err);
                    return res.status(500).json({
                        ok: false,
                        UserSaveErr: err
                    });
                }
                console.log('user.save:::', userDB);
                let token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }

    });
});

module.exports = app;
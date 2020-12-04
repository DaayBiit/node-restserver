require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion global de routes
app.use(require('./routes/index'));


app.get('/main', function (req, res) {
    res.send('Bienvenido a la App RestServer con Node')
});


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    }, 
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log("Base de datos online...");
        }
    });

app.listen(process.env.PORT, () => {
    console.log('La app rest server quedo esperando solicitudes en el puerto: ', process.env.PORT);
});
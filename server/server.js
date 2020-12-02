require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());


app.use(require('./routes/user'));

app.get('/api', function (req, res) {
    res.send('Hello API REST')
  });


mongoose.connect(process.env.URLDB,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    }, (err, res) => {
    if(err){
        throw err;
    }else {
        console.log("Base de datos online...");
    }
});

app.listen(process.env.PORT, () => {
    console.log('La app rest server quedo esperando solicitudes en el puerto: ', process.env.PORT);
});
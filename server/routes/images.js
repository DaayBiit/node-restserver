

const express = require('express');

const fs = require('fs');
const path = require('path');
const { verificarTokenImage } = require('../middlewares/authentication');

const app = express();

const User = require('../models/user');
const Product = require('../models/product');


app.get('/image/:entity/:image', verificarTokenImage, (req, res) => {

    let tipo = req.params.entity;
    let imagen = req.params.image;

    let pathImg = path.resolve(__filename,`../../../uploads/${tipo}/${imagen}`);
    console.log(pathImg);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        let pathNotImage = path.resolve(__filename, '../../assets/NotFound.jpg');
        res.sendFile(pathNotImage);
    }
})

module.exports = app;
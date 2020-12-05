const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

// default options
app.use(fileUpload());
console.log("File Upload");
app.put('/api/upload/:entity/:id', (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                mesagge: 'No files were uploaded.'
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    let splitArchivo = sampleFile.name.split('.');
    let extension = splitArchivo[splitArchivo.length - 1];

    console.log(extension);

    //extension permitidas
    let extensionValidas = ['png', 'jpg', 'pdf', 'doc', 'JPG'];

    if (extensionValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension del archivo nos es valida',
            extension
        })
    }

    //extension permitidas
    let entidadValidas = ['user', 'product'];
    let entidad = req.params.entity;
    if (entidadValidas.indexOf(entidad) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Entidad para el archivo nos es valida'

        })
    }

    //cambiar el nombre del archivo
    let nombreArchivo = `${req.params.id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${entidad}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (entidad === 'user') {
            imageUser(req.params.id, res, nombreArchivo, entidad);
        } else {
            imageProduct(req.params.id, res, nombreArchivo, entidad);
        }
    });

});


function imageUser(id, res, nameFile, entity) {

    User.findById(id)
        .exec((err, userDB) => {

            if (err) {
                borrarArchivo(nameFile, entity);
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

            borrarArchivo(nameFile, entity);

            userDB.img = nameFile;
            userDB.save((err, userSaved) => {
                if (err) {
                    // console.log("Error:::", err);
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    user: userSaved
                })
            })
        })

}

function imageProduct(id, res, nameFile, entity) {
    Product.findById(id)
        .exec((err, productDB) => {

            if (err) {
                borrarArchivo(nameFile, entity);
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!productDB || productDB === null) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            borrarArchivo(nameFile, entity);

            productDB.img = nameFile;
            productDB.save((err, productSaved) => {
                if (err) {
                    // console.log("Error:::", err);
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    user: productSaved
                })
            })
        })
}

function borrarArchivo(nombreArchivo, entity) {

    let pathImage = path.resolve(__dirname, `../../uploads/${entity}/${nombreArchivo}`);
    console.log("Borrar Archivo:::", pathImage);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }


}

module.exports = app;
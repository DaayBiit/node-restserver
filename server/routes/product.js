const express = require('express');

let {verificarToken, verificaAdminRole} = require('../middlewares/authentication');

let app = express();

let Product = require('../models/product');


app.get('/api/product/:id', verificarToken , (req, res) => {

   
    Product.findById(req.params.id)
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((err, productDB) => {
        if (err) {
           // console.log("Error:::", err);
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productDB || productDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            product: productDB
        })
        
    })


});

app.get('/api/product/find/:param', verificarToken , (req, res) => {
   
    let byParam = req.params.param;
    let regex = new RegExp(byParam, 'i');


    Product.find({name: regex})
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((err, productDB) => {
        if (err) {
           // console.log("Error:::", err);
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productDB || productDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            product: productDB
        })  
    })
});

app.get('/api/product', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Product.find({})
    .skip(desde)
    .limit(5)
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((err, productDB) => {
        if (err) {
           return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productDB || productDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no actualizada'
                }
            });
        }
        res.json({
            ok: true,
            products: productDB
        })
        
    })

});

app.post('/api/product', verificarToken, (req, res) => {
    let body = req.body;
    
    let product = new Product({
        name: body.name,
        costUni: body.costUni,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
        });
    
    product.save( (err, productDB) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB || productDB === null) {
            return res.status(400).json({
                ok: false,
                message: 'Producto no registrada'
            });
        }

        res.json({
            ok: true,
            product: productDB
        })

    })

});

app.put('/api/product/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let updateProduct = {
        name: body.name,
        costUni: body.costUni,
        description: body.description,
        available: body.available,
        category: body.category
    }

    Product.findByIdAndUpdate(id, updateProduct, { new: true, runValidators: true }, (err, productDB) => {

        if (err) {
            console.log("Error:::", err);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB || productDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no actualizada'
                }
            });
        }

        res.json({
            ok: true,
            user: productDB
        })
    })
});

app.patch('/api/product/:id', verificarToken, function (req, res) {
    let id = req.params.id;
    let cambioEstado = {
        available: false
    }
    Product.findByIdAndUpdate(id, cambioEstado, { new: true}, (err, productDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (productDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            productAvailable: productDB.available
        })

    })
})


app.delete('/api/product/:id', [ verificarToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Product.findByIdAndRemove(id, (err, productDB) => {
        if (err) {
            console.log("Error:::", err);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB || productDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no eliminada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto eliminada'
        })
    });

});

module.exports = app;

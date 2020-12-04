const express = require('express');

let {verificarToken, verificaAdminRole} = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');


app.get('/api/category/:id', verificarToken , (req, res) => {

   
    Category.findById(req.params.id)
    .populate('user', 'name email')
    .exec((err, categoryDB) => {
        if (err) {
           // console.log("Error:::", err);
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB || categoryDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        })
        
    })


});

app.get('/api/category', verificarToken, (req, res) => {

    Category.find({})
    .populate('user', 'name email')
    .exec((err, categoryDB) => {
        if (err) {
          
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB || categoryDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no actualizada'
                }
            });
        }
        res.json({
            ok: true,
            categories: categoryDB
        })
        
    })

});

app.post('/api/category', verificarToken, (req, res) => {
    let body = req.body;
    console.log("BODY:::", req.user);
    let category = new Category({
        description: body.description,
        user: req.user._id
    });
    
    category.save( (err, categoryDB) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB || categoryDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no registrada'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    })

});

app.put('/api/category/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        description : body.description
    }
    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {

        if (err) {
            console.log("Error:::", err);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB || categoryDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no actualizada'
                }
            });
        }

        res.json({
            ok: true,
            user: categoryDB
        })
    })
});

app.delete('/api/category/:id', [ verificarToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            console.log("Error:::", err);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB || categoryDB === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no eliminada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria eliminada'
        })
    });

});

module.exports = app;

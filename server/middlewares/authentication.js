//============================
// Verificar Token
//============================

const  jwt  = require("jsonwebtoken");

let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if (err) {
            console.log("Error:::", err);
            return res.status(400).json({
                ok: false,
                message: 'Token Invalido'
            })
        }

       req.user = decoded.user;
       next();
    })
}

let verificarRole = (req, res, next) => {


    
}

module.exports = { verificarToken };
//============================
// Verificar Token
//============================

const  jwt  = require("jsonwebtoken");

let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if (err) {
            console.log("jwt.verify Error:::", err);
            return res.status(400).json({
                ok: false,
                message: `Token Invalido::: ${token}`
            })
        }

       req.user = decoded.user;
       next();
    })
}

// =====================
// Verifica AdminRole
// =====================
let verificaAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports = { verificarToken, verificaAdminRole };
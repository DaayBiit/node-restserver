//==================================
// Puerto

const { urlencoded } = require("body-parser");

//==================================
process.env.PORT = process.env.PORT || 3000;

//==================================
// Entorno
//==================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==================================
// Base de datos
//==================================

let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27019/curso_node';
}else{
    urlDB = proccess.env.MONGO_URI;
    
}

process.env.URLDB = urlDB;
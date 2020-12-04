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
// Vencimiento del Token 60" 60' 24hs 30d
//==================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==================================
// Seed de Autenticacion
//==================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==================================
// Base de datos
//==================================
let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27019/curso_node';
}else{
    urlDB = process.env.MONGO_URI;
    
}

process.env.URLDB = urlDB;

//==================================
// google client ID
//==================================
process.env.CLIENT_ID = process.env.CLIENT_ID  || '233053202180-mq9p475o89o220n1shltjacqtr48vk94.apps.googleusercontent.com'
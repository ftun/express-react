// Puerto
process.env.PORT = process.env.PORT || 9000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BDS
const urlDB = "mongodb://127.0.0.1:27017/test";

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = "mongodb://localhost:27017/mediumNodeLogin";
// } else {
//     urlDB = "here write the mongo connection with mongo atlas and other type of connection mode"
// };

process.env.URLDB = urlDB;

// Caducidad token
process.env.CADUCIDAD_TOKEN = '48h';

// Seed de autenticcion
process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION || 'este-es-el-seed-desarrollo';

// Secreto de sesion
process.env.SESSION_SECRET =  process.env.SESSION_SECRET || 'myDevs2021';

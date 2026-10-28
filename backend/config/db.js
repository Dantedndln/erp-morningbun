const mysql = require('mysql2');
require('dotenv').config();

//las credenciales se leen de variables de entorno para no exponerlas al subir el repo
const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

conexion.connect((error) => {
  if (error) {
    console.error('Error de conexión a la base de datos:', error);
    return;
  }
  console.log('Conectado a MySQL');
});

module.exports = conexion;
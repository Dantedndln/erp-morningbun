// Aquí van las consultas SQL relacionadas con productos
const conexion = require('../config/db');
// Trae todos los productos registrados
const obtenerProductos = (callback) => {
  conexion.query('SELECT * FROM productos', (error, resultados) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, resultados);
  });
};

module.exports = { obtenerProductos };
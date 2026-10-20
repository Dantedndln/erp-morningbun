const db = require('../config/db');

// Solo los productos vigentes se muestran en el catálogo y el inventario
function obtenerProductos(callback) {
  const sql = 'SELECT * FROM productos WHERE vigente = 1 ORDER BY nombre';
  db.query(sql, (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

// Filtra por categoría, también solo vigentes
function obtenerPorCategoria(categoria, callback) {
  const sql = 'SELECT * FROM productos WHERE categoria = ? AND vigente = 1 ORDER BY nombre';
  db.query(sql, [categoria], (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

function crearProducto(producto, callback) {
  const sql = `
    INSERT INTO productos
      (nombre, categoria, descripcion, precio, stock, imagen, vigente, fecha_alta)
    VALUES (?, ?, ?, ?, ?, ?, 1, CURDATE())
  `;
  const valores = [
    producto.nombre,
    producto.categoria,
    producto.descripcion,
    producto.precio,
    producto.stock,
    producto.imagen
  ];
  db.query(sql, valores, (error, resultado) => {
    if (error) { callback(error, null); return; }
    callback(null, { id: resultado.insertId, ...producto });
  });
}

// Modificar un producto no actualiza el registro: da de baja el anterior y crea uno nuevo vigente, para no alterar los detalles 
// históricos de ventas y compras ya registradas
function modificarProducto(id, producto, callback) {
  const sqlBaja = 'UPDATE productos SET vigente = 0, fecha_baja = CURDATE() WHERE id = ?';
  db.query(sqlBaja, [id], (error) => {
    if (error) { callback(error, null); return; }
    crearProducto(producto, callback);
  });
}

// El registro permanece en la base de datos
function darDeBajaProducto(id, callback) {
  const sql = 'UPDATE productos SET vigente = 0, fecha_baja = CURDATE() WHERE id = ?';
  db.query(sql, [id], (error) => {
    if (error) { callback(error, null); return; }
    callback(null, { mensaje: 'Producto dado de baja' });
  });
}

// Consulta los productos por sus identificadores
// devuelve una promesa porque se utiliza dentro del flujo de pago,
// que es asíncrono por las llamadas a la API de PayPal
function obtenerPorIds(ids) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM productos WHERE id IN (?) AND vigente = 1';
    db.query(sql, [ids], (error, resultados) => {
      if (error) { reject(error); return; }
      resolve(resultados);
    });
  });
}

module.exports = {
  obtenerProductos,
  obtenerPorCategoria,
  crearProducto,
  modificarProducto,
  darDeBajaProducto,
  obtenerPorIds
};
const db = require('../config/db');

// Si un proveedor sigue vigente lo trae, si no no lo va a mostrar
function obtenerProveedores(callback) {
  const sql = 'SELECT * FROM proveedores WHERE vigente = 1 ORDER BY nombre';
  db.query(sql, (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

function crearProveedor(proveedor, callback) {
  const sql = 'INSERT INTO proveedores (nombre, telefono, correo, vigente) VALUES (?, ?, ?, 1)';
  const valores = [proveedor.nombre, proveedor.telefono, proveedor.correo];
  db.query(sql, valores, (error, resultado) => {
    if (error) { callback(error, null); return; }
    callback(null, { id: resultado.insertId, ...proveedor });
  });
}

// A diferencia de los productos, modificar un proveedor sí actualiza el registro porque sus datos de contacto 
// no afectan las compras ya registradas
function modificarProveedor(id, proveedor, callback) {
  const sql = 'UPDATE proveedores SET nombre = ?, telefono = ?, correo = ? WHERE id = ?';
  const valores = [proveedor.nombre, proveedor.telefono, proveedor.correo, id];
  db.query(sql, valores, (error) => {
    if (error) { callback(error, null); return; }
    callback(null, { id, ...proveedor });
  });
}

// Las compras registradas siguen referenciando al proveedor aunque ya no esté vigente, para mantener la integridad histórica 
// de los datos
function darDeBajaProveedor(id, callback) {
  const sql = 'UPDATE proveedores SET vigente = 0, fecha_baja = CURDATE() WHERE id = ?';
  db.query(sql, [id], (error) => {
    if (error) { callback(error, null); return; }
    callback(null, { mensaje: 'Proveedor dado de baja' });
  });
}

module.exports = { obtenerProveedores, crearProveedor, modificarProveedor, darDeBajaProveedor };

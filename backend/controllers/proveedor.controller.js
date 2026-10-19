const proveedorService = require('../services/proveedor.service');

function obtenerProveedores(req, res) {
  proveedorService.obtenerProveedores((error, proveedores) => {
    if (error) {
      console.error('Error al consultar proveedores:', error);
      return res.status(500).json({ mensaje: 'Error al consultar proveedores' });
    }
    res.json(proveedores);
  });
}

function crearProveedor(req, res) {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre del proveedor es obligatorio' });
  }

  proveedorService.crearProveedor(req.body, (error, proveedor) => {
    if (error) {
      console.error('Error al crear proveedor:', error);
      return res.status(500).json({ mensaje: 'Error al registrar el proveedor' });
    }
    res.status(201).json(proveedor);
  });
}

function modificarProveedor(req, res) {
  proveedorService.modificarProveedor(req.params.id, req.body, (error, proveedor) => {
    if (error) {
      console.error('Error al modificar proveedor:', error);
      return res.status(500).json({ mensaje: 'Error al modificar el proveedor' });
    }
    res.json(proveedor);
  });
}

function darDeBajaProveedor(req, res) {
  proveedorService.darDeBajaProveedor(req.params.id, (error, respuesta) => {
    if (error) {
      console.error('Error al dar de baja proveedor:', error);
      return res.status(500).json({ mensaje: 'Error al dar de baja el proveedor' });
    }
    res.json(respuesta);
  });
}

module.exports = { obtenerProveedores, crearProveedor, modificarProveedor, darDeBajaProveedor };
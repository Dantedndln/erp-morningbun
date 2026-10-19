const productoService = require('../services/producto.service');

// GET /api/productos  o  GET /api/productos?categoria=Café
function obtenerProductos(req, res) {
  const categoria = req.query.categoria;

  // el filtrado se hace en el servidor para no enviar al cliente registros que no necesita :>
  if (categoria) {
    productoService.obtenerPorCategoria(categoria, (error, productos) => {
      if (error) {
        console.error('Error al consultar productos:', error);
        return res.status(500).json({ mensaje: 'Error al consultar productos' });
      }
      res.json(productos);
    });
    return;
  }

  productoService.obtenerProductos((error, productos) => {
    if (error) {
      console.error('Error al consultar productos:', error);
      return res.status(500).json({ mensaje: 'Error al consultar productos' });
    }
    res.json(productos);
  });
}

// POST /api/productos
function crearProducto(req, res) {
  const { nombre, categoria, precio, stock } = req.body;

  if (!nombre || !categoria) {
    return res.status(400).json({ mensaje: 'El nombre y la categoría son obligatorios' });
  }
  if (precio <= 0) {
    return res.status(400).json({ mensaje: 'El precio debe ser mayor que cero' });
  }
  if (stock < 0) {
    return res.status(400).json({ mensaje: 'La existencia no puede ser negativa' });
  }

  productoService.crearProducto(req.body, (error, producto) => {
    if (error) {
      console.error('Error al crear producto:', error);
      return res.status(500).json({ mensaje: 'Error al crear el producto' });
    }
    res.status(201).json(producto);
  });
}

// PUT /api/productos/:id
function modificarProducto(req, res) {
  productoService.modificarProducto(req.params.id, req.body, (error, producto) => {
    if (error) {
      console.error('Error al modificar producto:', error);
      return res.status(500).json({ mensaje: 'Error al modificar el producto' });
    }
    res.json(producto);
  });
}

// PATCH /api/productos/:id/baja
function darDeBajaProducto(req, res) {
  productoService.darDeBajaProducto(req.params.id, (error, respuesta) => {
    if (error) {
      console.error('Error al dar de baja producto:', error);
      return res.status(500).json({ mensaje: 'Error al dar de baja el producto' });
    }
    res.json(respuesta);
  });
}

module.exports = { obtenerProductos, crearProducto, modificarProducto, darDeBajaProducto };
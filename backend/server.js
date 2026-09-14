const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const productoRoutes = require('./routes/producto.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const compraRoutes = require('./routes/compra.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const ventaRoutes = require('./routes/venta.routes');
const contabilidadRoutes = require('./routes/contabilidad.routes');
app.use('/api/contabilidad', contabilidadRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/empleados', empleadoRoutes);

app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
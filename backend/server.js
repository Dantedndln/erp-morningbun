require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Rutas de la API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/proveedores', require('./routes/proveedor.routes'));
app.use('/api/compras', require('./routes/compra.routes'));
app.use('/api/ventas', require('./routes/venta.routes'));
app.use('/api/empleados', require('./routes/empleado.routes'));
app.use('/api/contabilidad', require('./routes/contabilidad.routes'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${process.env.PORT}`);
});
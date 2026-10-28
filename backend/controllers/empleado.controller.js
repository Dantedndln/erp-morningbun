const empleadoService = require('../services/empleado.service');
//full consultas en el apartado de los empleados para la sección de recursos humanos
function obtenerEmpleados(req, res) {
  empleadoService.obtenerEmpleados((error, empleados) => {
    if (error) {
      console.error('Error al consultar empleados:', error);
      return res.status(500).json({ mensaje: 'Error al consultar empleados' });
    }
    res.json(empleados);
  });
}

function obtenerPagos(req, res) {
  empleadoService.obtenerPagos((error, pagos) => {
    if (error) {
      console.error('Error al consultar pagos:', error);
      return res.status(500).json({ mensaje: 'Error al consultar pagos' });
    }
    res.json(pagos);
  });
}

module.exports = { obtenerEmpleados, obtenerPagos };
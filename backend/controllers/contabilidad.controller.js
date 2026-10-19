const contabilidadService = require('../services/contabilidad.service');

function obtenerMovimientos(req, res) {
  contabilidadService.obtenerMovimientos((error, movimientos) => {
    if (error) {
      console.error('Error al consultar movimientos:', error);
      return res.status(500).json({ mensaje: 'Error al consultar movimientos' });
    }
    res.json(movimientos);
  });
}

function obtenerResumen(req, res) {
  contabilidadService.obtenerResumen((error, resumen) => {
    if (error) {
      console.error('Error al consultar el resumen:', error);
      return res.status(500).json({ mensaje: 'Error al consultar el resumen' });
    }
    res.json(resumen);
  });
}

module.exports = { obtenerMovimientos, obtenerResumen };
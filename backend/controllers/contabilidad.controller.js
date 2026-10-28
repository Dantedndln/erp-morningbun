const contabilidadService = require('../services/contabilidad.service');

//si no se indica un periodo, se toma el mes en curso
function periodoPorDefecto() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const ultimoDia = new Date(anio, hoy.getMonth() + 1, 0).getDate();

  return {
    desde: `${anio}-${mes}-01`,
    hasta: `${anio}-${mes}-${ultimoDia}`
  };
}

//lee y valida el rango recibido en la petición
function leerPeriodo(req, res) {
  const porDefecto = periodoPorDefecto();
  const desde = req.query.desde || porDefecto.desde;
  const hasta = req.query.hasta || porDefecto.hasta;

  //la fecha final no puede ser anterior a la inicial
  if (hasta < desde) {
    res.status(400).json({ mensaje: 'La fecha final no puede ser anterior a la inicial' });
    return null;
  }

  return { desde, hasta };
}

function obtenerMovimientos(req, res) {
  const periodo = leerPeriodo(req, res);
  if (!periodo) { return; }

  contabilidadService.obtenerMovimientos(periodo.desde, periodo.hasta, (error, movimientos) => {
    if (error) {
      console.error('Error al consultar movimientos:', error);
      return res.status(500).json({ mensaje: 'Error al consultar movimientos' });
    }
    res.json(movimientos);
  });
}

function obtenerResumen(req, res) {
  const periodo = leerPeriodo(req, res);
  if (!periodo) { return; }

  contabilidadService.obtenerResumen(periodo.desde, periodo.hasta, (error, resumen) => {
    if (error) {
      console.error('Error al consultar el resumen:', error);
      return res.status(500).json({ mensaje: 'Error al consultar el resumen' });
    }
    res.json(resumen);
  });
}

function obtenerGrafica(req, res) {
  const periodo = leerPeriodo(req, res);
  if (!periodo) { return; }

  contabilidadService.obtenerGrafica(periodo.desde, periodo.hasta, (error, datos) => {
    if (error) {
      console.error('Error al consultar la gráfica:', error);
      return res.status(500).json({ mensaje: 'Error al consultar la gráfica' });
    }
    res.json(datos);
  });
}

module.exports = { obtenerMovimientos, obtenerResumen, obtenerGrafica };
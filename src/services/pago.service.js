const pagoRepository = require('../repositories/pago.repository');
const suscripcionRepository = require('../repositories/suscripcion.repository');

async function registrarPago(payload) {
  const { usuario_id, suscripcion_id, concepto, monto, metodo_pago } = payload;
  const pago = await pagoRepository.create({
    usuario_id,
    suscripcion_id: suscripcion_id || null,
    concepto,
    monto,
    metodo_pago,
    estado: 'completado',
    fecha_pago: new Date()
  });

  // Si el pago está vinculado a una suscripción, activarla automáticamente
  if (suscripcion_id) {
    await suscripcionRepository.updateById(suscripcion_id, { estado: 'activa', pagado: true });
  }

  return pago;
}

async function listarPagos() {
  return pagoRepository.findAll();
}

async function obtenerPagoPorId(id) {
  return pagoRepository.findById(id);
}

async function misPagos(usuario_id) {
  return pagoRepository.findByUsuarioId(usuario_id);
}

async function reporteVentas(fecha_inicio, fecha_fin) {
  return pagoRepository.reporteVentas({ fecha_inicio, fecha_fin });
}

module.exports = { registrarPago, listarPagos, obtenerPagoPorId, misPagos, reporteVentas };

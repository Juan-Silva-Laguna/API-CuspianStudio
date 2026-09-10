const suscripcionRepository = require('../repositories/suscripcion.repository');
const planRepository = require('../repositories/plan.repository');

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

async function suscribir(usuario_id, plan_id) {
  const plan = await planRepository.findById(plan_id);
  if (!plan) throw new Error('Plan no encontrado.');
  if (!plan.activo) throw new Error('El plan no está disponible.');

  const activa = await suscripcionRepository.findActivaByUsuarioId(usuario_id);
  if (activa) throw new Error('El usuario ya tiene una suscripción activa.');

  const fecha_inicio = new Date().toISOString().split('T')[0];
  const fecha_fin = addMonths(fecha_inicio, 1);

  return suscripcionRepository.create({
    usuario_id,
    plan_id,
    fecha_inicio,
    fecha_fin,
    estado: 'inactiva',
    clases_usadas_mes: 0,
    pagado: false
  });
}

async function activarSuscripcion(suscripcion_id) {
  const suscripcion = await suscripcionRepository.findById(suscripcion_id);
  if (!suscripcion) throw new Error('Suscripción no encontrada.');
  return suscripcionRepository.updateById(suscripcion_id, { estado: 'activa', pagado: true });
}

async function listarSuscripciones() {
  return suscripcionRepository.findAll();
}

async function obtenerSuscripcionPorId(id) {
  return suscripcionRepository.findById(id);
}

async function miSuscripcion(usuario_id) {
  return suscripcionRepository.findActivaByUsuarioId(usuario_id);
}

async function renovarSuscripcion(suscripcion_id) {
  const suscripcion = await suscripcionRepository.findById(suscripcion_id);
  if (!suscripcion) throw new Error('Suscripción no encontrada.');
  const fecha_inicio = new Date().toISOString().split('T')[0];
  const fecha_fin = addMonths(fecha_inicio, 1);
  return suscripcionRepository.updateById(suscripcion_id, {
    fecha_inicio,
    fecha_fin,
    estado: 'activa',
    clases_usadas_mes: 0,
    pagado: false
  });
}

async function resetearClasesMensuales() {
  const activas = await suscripcionRepository.findAll();
  const promises = activas
    .filter((s) => s.estado === 'activa')
    .map((s) => suscripcionRepository.updateById(s.id, { clases_usadas_mes: 0 }));
  return Promise.all(promises);
}

module.exports = {
  suscribir,
  activarSuscripcion,
  listarSuscripciones,
  obtenerSuscripcionPorId,
  miSuscripcion,
  renovarSuscripcion,
  resetearClasesMensuales
};

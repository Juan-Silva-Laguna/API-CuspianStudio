const reservaRepository = require('../repositories/reserva.repository');
const suscripcionRepository = require('../repositories/suscripcion.repository');
const horarioRepository = require('../repositories/horario.repository');

async function crearReserva(usuario_id, horario_id, fecha) {
  // 1. Verificar suscripción activa
  const suscripcion = await suscripcionRepository.findActivaByUsuarioId(usuario_id);
  if (!suscripcion) throw new Error('No tienes una suscripción activa.');
  if (!suscripcion.pagado) throw new Error('Tu suscripción no ha sido confirmada aún.');

  const plan = suscripcion.plan;

  // 2. Verificar cupo de clases del mes (si el plan no es ilimitado)
  if (plan.clases_por_mes !== null) {
    const [year, month] = fecha.split('-').map(Number);
    const clasesUsadas = await reservaRepository.countClasesUsadasEnMes(usuario_id, year, month);
    if (clasesUsadas >= plan.clases_por_mes) {
      throw new Error(`Has alcanzado el límite de ${plan.clases_por_mes} clases para este mes.`);
    }
  }

  // 3. Verificar que el horario exista y esté activo
  const horario = await horarioRepository.findById(horario_id);
  if (!horario) throw new Error('Horario no encontrado.');
  if (horario.estado !== 'activo') throw new Error('El horario no está disponible.');

  // 4. Verificar cupo en la sala
  const reservasEnClase = await reservaRepository.countConfirmadasPorHorarioFecha(horario_id, fecha);
  if (reservasEnClase >= horario.cupo_maximo) {
    throw new Error('No hay cupo disponible para esta clase.');
  }

  // 5. Verificar reserva duplicada
  const duplicada = await reservaRepository.findDuplicada(usuario_id, horario_id, fecha);
  if (duplicada) throw new Error('Ya tienes una reserva para este horario en esa fecha.');

  // 6. Crear reserva e incrementar clases usadas
  const reserva = await reservaRepository.create({ usuario_id, horario_id, fecha, estado: 'confirmada' });
  await suscripcionRepository.updateById(suscripcion.id, {
    clases_usadas_mes: suscripcion.clases_usadas_mes + 1
  });

  return reserva;
}

async function cancelarReserva(reserva_id, usuario_id) {
  const reserva = await reservaRepository.findById(reserva_id);
  if (!reserva) throw new Error('Reserva no encontrada.');
  if (reserva.usuario_id !== Number(usuario_id)) throw new Error('No tienes permiso para cancelar esta reserva.');
  if (reserva.estado !== 'confirmada') throw new Error('Solo se pueden cancelar reservas confirmadas.');

  await reservaRepository.updateById(reserva_id, { estado: 'cancelada' });

  // Revertir clase usada en la suscripción
  const suscripcion = await suscripcionRepository.findActivaByUsuarioId(usuario_id);
  if (suscripcion && suscripcion.clases_usadas_mes > 0) {
    await suscripcionRepository.updateById(suscripcion.id, {
      clases_usadas_mes: suscripcion.clases_usadas_mes - 1
    });
  }

  return reservaRepository.findById(reserva_id);
}

async function listarReservas() {
  return reservaRepository.findAll();
}

async function misReservas(usuario_id) {
  return reservaRepository.findByUsuarioId(usuario_id);
}

async function reservasPorHorario(horario_id) {
  return reservaRepository.findByHorarioId(horario_id);
}

async function marcarAsistencia(reserva_id) {
  return reservaRepository.updateById(reserva_id, { estado: 'asistio' });
}

module.exports = {
  crearReserva,
  cancelarReserva,
  listarReservas,
  misReservas,
  reservasPorHorario,
  marcarAsistencia
};

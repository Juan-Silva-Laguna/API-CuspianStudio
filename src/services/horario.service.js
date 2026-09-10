const horarioRepository = require('../repositories/horario.repository');

async function crearHorario(payload) {
  const { sala_id, entrenador_id, dia_semana, hora_inicio, hora_fin } = payload;

  const conflictoSala = await horarioRepository.findConflictoSala(
    sala_id, dia_semana, hora_inicio, hora_fin
  );
  if (conflictoSala.length > 0) {
    throw new Error('La sala ya tiene un horario activo en ese día y franja horaria.');
  }

  const conflictoEntrenador = await horarioRepository.findConflictoEntrenador(
    entrenador_id, dia_semana, hora_inicio, hora_fin
  );
  if (conflictoEntrenador.length > 0) {
    throw new Error('El entrenador ya tiene un horario activo en ese día y franja horaria.');
  }

  return horarioRepository.create(payload);
}

async function listarHorarios() {
  return horarioRepository.findAll();
}

async function obtenerHorarioPorId(id) {
  return horarioRepository.findById(id);
}

async function horariosDisponiblesPorServicio(servicio_id) {
  return horarioRepository.findByServicioId(servicio_id);
}

async function actualizarHorario(id, payload) {
  if (payload.sala_id || payload.dia_semana || payload.hora_inicio || payload.hora_fin) {
    const actual = await horarioRepository.findById(id);
    if (!actual) throw new Error('Horario no encontrado.');
    const sala_id = payload.sala_id || actual.sala_id;
    const entrenador_id = payload.entrenador_id || actual.entrenador_id;
    const dia_semana = payload.dia_semana !== undefined ? payload.dia_semana : actual.dia_semana;
    const hora_inicio = payload.hora_inicio || actual.hora_inicio;
    const hora_fin = payload.hora_fin || actual.hora_fin;

    const conflictoSala = await horarioRepository.findConflictoSala(sala_id, dia_semana, hora_inicio, hora_fin, id);
    if (conflictoSala.length > 0) throw new Error('La sala ya tiene un horario activo en ese día y franja horaria.');

    const conflictoEntrenador = await horarioRepository.findConflictoEntrenador(entrenador_id, dia_semana, hora_inicio, hora_fin, id);
    if (conflictoEntrenador.length > 0) throw new Error('El entrenador ya tiene un horario activo en ese día y franja horaria.');
  }
  return horarioRepository.updateById(id, payload);
}

async function eliminarHorario(id) {
  return horarioRepository.deleteById(id);
}

module.exports = {
  crearHorario,
  listarHorarios,
  obtenerHorarioPorId,
  horariosDisponiblesPorServicio,
  actualizarHorario,
  eliminarHorario
};

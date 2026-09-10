const salaRepository = require('../repositories/sala.repository');

async function crearSala(payload) {
  return salaRepository.create(payload);
}

async function listarSalas() {
  return salaRepository.findAll();
}

async function obtenerSalaPorId(id) {
  return salaRepository.findById(id);
}

async function actualizarSala(id, payload) {
  return salaRepository.updateById(id, payload);
}

async function eliminarSala(id) {
  return salaRepository.deleteById(id);
}

module.exports = { crearSala, listarSalas, obtenerSalaPorId, actualizarSala, eliminarSala };

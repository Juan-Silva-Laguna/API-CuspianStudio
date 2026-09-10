const planRepository = require('../repositories/plan.repository');

async function crearPlan(payload) {
  return planRepository.create(payload);
}

async function listarPlanes() {
  return planRepository.findAll();
}

async function obtenerPlanPorId(id) {
  return planRepository.findById(id);
}

async function actualizarPlan(id, payload) {
  return planRepository.updateById(id, payload);
}

async function eliminarPlan(id) {
  return planRepository.deleteById(id);
}

module.exports = { crearPlan, listarPlanes, obtenerPlanPorId, actualizarPlan, eliminarPlan };

const servicioRepository = require('../repositories/servicio.repository');

async function crearServicio(payload) {
  return servicioRepository.create(payload);
}

async function listarServicios() {
  return servicioRepository.findAll();
}

async function obtenerServicioPorId(id) {
  return servicioRepository.findById(id);
}

async function actualizarServicio(id, payload) {
  return servicioRepository.updateById(id, payload);
}

async function eliminarServicio(id) {
  return servicioRepository.deleteById(id);
}

module.exports = {
  crearServicio,
  listarServicios,
  obtenerServicioPorId,
  actualizarServicio,
  eliminarServicio
};

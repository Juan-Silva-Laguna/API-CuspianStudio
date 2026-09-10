const { Servicio } = require('../models');

async function create(data) {
  return Servicio.create(data);
}

async function findAll() {
  return Servicio.findAll({ order: [['nombre', 'ASC']] });
}

async function findById(id) {
  return Servicio.findByPk(id);
}

async function updateById(id, data) {
  const servicio = await Servicio.findByPk(id);
  if (!servicio) return null;
  await servicio.update(data);
  return servicio;
}

async function deleteById(id) {
  const servicio = await Servicio.findByPk(id);
  if (!servicio) return null;
  await servicio.destroy();
  return servicio;
}

module.exports = { create, findAll, findById, updateById, deleteById };

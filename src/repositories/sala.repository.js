const { Sala } = require('../models');

async function create(data) {
  return Sala.create(data);
}

async function findAll() {
  return Sala.findAll({ order: [['nombre', 'ASC']] });
}

async function findById(id) {
  return Sala.findByPk(id);
}

async function updateById(id, data) {
  const sala = await Sala.findByPk(id);
  if (!sala) return null;
  await sala.update(data);
  return sala;
}

async function deleteById(id) {
  const sala = await Sala.findByPk(id);
  if (!sala) return null;
  await sala.destroy();
  return sala;
}

module.exports = { create, findAll, findById, updateById, deleteById };

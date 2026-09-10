const { Entrenador, Usuario } = require('../models');

async function create(data) {
  return Entrenador.create(data);
}

async function findAll() {
  return Entrenador.findAll({
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email', 'telefono'] }],
    order: [['id', 'ASC']]
  });
}

async function findById(id) {
  return Entrenador.findByPk(id, {
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email', 'telefono'] }]
  });
}

async function findByUsuarioId(usuario_id) {
  return Entrenador.findOne({ where: { usuario_id } });
}

async function updateById(id, data) {
  const entrenador = await Entrenador.findByPk(id);
  if (!entrenador) return null;
  await entrenador.update(data);
  return entrenador;
}

async function deleteById(id) {
  const entrenador = await Entrenador.findByPk(id);
  if (!entrenador) return null;
  await entrenador.destroy();
  return entrenador;
}

module.exports = { create, findAll, findById, findByUsuarioId, updateById, deleteById };

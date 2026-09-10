const Usuario = require('../models/usuario.model');

async function create(data) {
  return Usuario.create(data);
}

async function findAll() {
  return Usuario.findAll({ order: [['id', 'ASC']] });
}

async function findById(id) {
  return Usuario.findByPk(id);
}

async function findByEmail(email) {
  return Usuario.findOne({ where: { email } });
}

async function updateById(id, data) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    return null;
  }

  await usuario.update(data);
  return usuario;
}

async function deleteById(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    return null;
  }

  await usuario.destroy();
  return usuario;
}

module.exports = {
  create,
  findAll,
  findById,
  findByEmail,
  updateById,
  deleteById
};

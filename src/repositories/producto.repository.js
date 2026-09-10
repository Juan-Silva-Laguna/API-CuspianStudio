const Producto = require('../models/producto.model');

async function create(data) {
  return Producto.create(data);
}

async function findAll() {
  return Producto.findAll({ order: [['id', 'ASC']] });
}

async function findById(id) {
  return Producto.findByPk(id);
}

async function updateById(id, data) {
  const producto = await Producto.findByPk(id);
  if (!producto) {
    return null;
  }

  await producto.update(data);
  return producto;
}

async function deleteById(id) {
  const producto = await Producto.findByPk(id);
  if (!producto) {
    return null;
  }

  await producto.destroy();
  return producto;
}

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById
};

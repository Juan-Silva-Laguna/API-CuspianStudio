const productoRepository = require('../repositories/producto.repository');

async function crearProducto(payload) {
  const { nombre, descripcion, precio } = payload;
  return productoRepository.create({ nombre, descripcion, precio });
}

async function listarProductos() {
  return productoRepository.findAll();
}

async function obtenerProductoPorId(id) {
  return productoRepository.findById(id);
}

async function actualizarProducto(id, payload) {
  const { nombre, descripcion, precio } = payload;
  return productoRepository.updateById(id, { nombre, descripcion, precio });
}

async function eliminarProducto(id) {
  return productoRepository.deleteById(id);
}

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
};

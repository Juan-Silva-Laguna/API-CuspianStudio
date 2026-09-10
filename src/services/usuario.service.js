const usuarioRepository = require('../repositories/usuario.repository');

async function crearUsuario(payload) {
  const { nombre, email, password, rol } = payload;
  return usuarioRepository.create({ nombre, email, password, rol });
}

async function listarUsuarios() {
  return usuarioRepository.findAll();
}

async function obtenerUsuarioPorId(id) {
  return usuarioRepository.findById(id);
}

async function actualizarUsuario(id, payload) {
  const { nombre, email, password, rol } = payload;
  return usuarioRepository.updateById(id, { nombre, email, password, rol });
}

async function eliminarUsuario(id) {
  return usuarioRepository.deleteById(id);
}

module.exports = {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};

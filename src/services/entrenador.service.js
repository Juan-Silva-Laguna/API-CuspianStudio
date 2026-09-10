const entrenadorRepository = require('../repositories/entrenador.repository');
const usuarioRepository = require('../repositories/usuario.repository');

async function crearEntrenador(payload) {
  const { usuario_id, especialidades, biografia, certificaciones } = payload;
  const usuario = await usuarioRepository.findById(usuario_id);
  if (!usuario) throw new Error('Usuario no encontrado.');
  if (usuario.rol !== 'entrenador') {
    await usuarioRepository.updateById(usuario_id, { rol: 'entrenador' });
  }
  const existente = await entrenadorRepository.findByUsuarioId(usuario_id);
  if (existente) throw new Error('Este usuario ya tiene perfil de entrenador.');
  return entrenadorRepository.create({ usuario_id, especialidades, biografia, certificaciones });
}

async function listarEntrenadores() {
  return entrenadorRepository.findAll();
}

async function obtenerEntrenadorPorId(id) {
  return entrenadorRepository.findById(id);
}

async function actualizarEntrenador(id, payload) {
  return entrenadorRepository.updateById(id, payload);
}

async function eliminarEntrenador(id) {
  const entrenador = await entrenadorRepository.findById(id);
  if (!entrenador) return null;
  await usuarioRepository.updateById(entrenador.usuario_id, { rol: 'cliente' });
  return entrenadorRepository.deleteById(id);
}

module.exports = {
  crearEntrenador,
  listarEntrenadores,
  obtenerEntrenadorPorId,
  actualizarEntrenador,
  eliminarEntrenador
};

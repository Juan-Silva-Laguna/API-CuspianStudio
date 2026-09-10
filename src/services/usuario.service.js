const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const usuarioRepository = require('../repositories/usuario.repository');

function generarCodigoQR() {
  return 'QR-' + crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase();
}

async function registrarUsuario(payload) {
  const { nombre, email, password, rol, telefono, fecha_nacimiento } = payload;
  const existe = await usuarioRepository.findByEmail(email);
  if (existe) throw new Error('El email ya está registrado.');
  const hash = await bcrypt.hash(password, 10);
  const codigo_qr = generarCodigoQR();
  return usuarioRepository.create({ nombre, email, password: hash, rol, telefono, fecha_nacimiento, codigo_qr });
}

async function listarUsuarios() {
  return usuarioRepository.findAll();
}

async function obtenerUsuarioPorId(id) {
  return usuarioRepository.findById(id);
}

async function actualizarUsuario(id, payload) {
  const campos = { ...payload };
  if (campos.password) {
    campos.password = await bcrypt.hash(campos.password, 10);
  }
  return usuarioRepository.updateById(id, campos);
}

async function eliminarUsuario(id) {
  return usuarioRepository.deleteById(id);
}

module.exports = {
  registrarUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};

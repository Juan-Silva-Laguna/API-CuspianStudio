const { Reserva, Horario, Usuario } = require('../models');

async function create(data) {
  return Reserva.create(data);
}

async function findAll() {
  return Reserva.findAll({
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
      { model: Horario, as: 'horario' }
    ],
    order: [['fecha', 'DESC']]
  });
}

async function findById(id) {
  return Reserva.findByPk(id, {
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
      { model: Horario, as: 'horario' }
    ]
  });
}

async function findByUsuarioId(usuario_id) {
  return Reserva.findAll({
    where: { usuario_id },
    include: [{ model: Horario, as: 'horario' }],
    order: [['fecha', 'DESC']]
  });
}

async function countConfirmadasPorHorarioFecha(horario_id, fecha) {
  return Reserva.count({ where: { horario_id, fecha, estado: 'confirmada' } });
}

async function findDuplicada(usuario_id, horario_id, fecha) {
  return Reserva.findOne({ where: { usuario_id, horario_id, fecha, estado: 'confirmada' } });
}

async function countClasesUsadasEnMes(usuario_id, year, month) {
  const { Op } = require('sequelize');
  const inicio = `${year}-${String(month).padStart(2, '0')}-01`;
  const fin = new Date(year, month, 0).toISOString().split('T')[0];
  return Reserva.count({
    where: {
      usuario_id,
      estado: { [Op.in]: ['confirmada', 'asistio'] },
      fecha: { [Op.between]: [inicio, fin] }
    }
  });
}

async function findByHorarioId(horario_id) {
  return Reserva.findAll({
    where: { horario_id },
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email', 'codigo_qr'] }],
    order: [['fecha', 'DESC']]
  });
}

async function findByFecha(fecha) {
  return Reserva.findAll({
    where: { fecha },
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
      { model: Horario, as: 'horario' }
    ],
    order: [['createdAt', 'ASC']]
  });
}

async function updateById(id, data) {
  const reserva = await Reserva.findByPk(id);
  if (!reserva) return null;
  await reserva.update(data);
  return reserva;
}

module.exports = {
  create,
  findAll,
  findById,
  findByUsuarioId,
  countConfirmadasPorHorarioFecha,
  findDuplicada,
  countClasesUsadasEnMes,
  findByHorarioId,
  findByFecha,
  updateById
};

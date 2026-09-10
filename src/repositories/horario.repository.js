const { Horario, Servicio, Sala, Entrenador, Usuario } = require('../models');

const defaultIncludes = [
  { model: Servicio, as: 'servicio' },
  { model: Sala, as: 'sala' },
  {
    model: Entrenador,
    as: 'entrenador',
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }]
  }
];

async function create(data) {
  return Horario.create(data);
}

async function findAll() {
  return Horario.findAll({ include: defaultIncludes, order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']] });
}

async function findById(id) {
  return Horario.findByPk(id, { include: defaultIncludes });
}

async function findByServicioId(servicio_id) {
  return Horario.findAll({
    where: { servicio_id, estado: 'activo' },
    include: defaultIncludes,
    order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']]
  });
}

async function findConflictoSala(sala_id, dia_semana, hora_inicio, hora_fin, excludeId = null) {
  const { Op } = require('sequelize');
  const where = {
    sala_id,
    dia_semana,
    estado: 'activo',
    [Op.or]: [
      { hora_inicio: { [Op.between]: [hora_inicio, hora_fin] } },
      { hora_fin: { [Op.between]: [hora_inicio, hora_fin] } },
      {
        hora_inicio: { [Op.lte]: hora_inicio },
        hora_fin: { [Op.gte]: hora_fin }
      }
    ]
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  return Horario.findAll({ where });
}

async function findConflictoEntrenador(entrenador_id, dia_semana, hora_inicio, hora_fin, excludeId = null) {
  const { Op } = require('sequelize');
  const where = {
    entrenador_id,
    dia_semana,
    estado: 'activo',
    [Op.or]: [
      { hora_inicio: { [Op.between]: [hora_inicio, hora_fin] } },
      { hora_fin: { [Op.between]: [hora_inicio, hora_fin] } },
      {
        hora_inicio: { [Op.lte]: hora_inicio },
        hora_fin: { [Op.gte]: hora_fin }
      }
    ]
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  return Horario.findAll({ where });
}

async function updateById(id, data) {
  const horario = await Horario.findByPk(id);
  if (!horario) return null;
  await horario.update(data);
  return horario;
}

async function deleteById(id) {
  const horario = await Horario.findByPk(id);
  if (!horario) return null;
  await horario.destroy();
  return horario;
}

module.exports = {
  create,
  findAll,
  findById,
  findByServicioId,
  findConflictoSala,
  findConflictoEntrenador,
  updateById,
  deleteById
};

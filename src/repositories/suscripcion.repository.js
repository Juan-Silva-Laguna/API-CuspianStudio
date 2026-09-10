const { Op } = require('sequelize');
const { Suscripcion, Plan, Usuario } = require('../models');

async function create(data) {
  return Suscripcion.create(data);
}

async function findAll() {
  return Suscripcion.findAll({
    include: [
      { model: Plan, as: 'plan' },
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
    ],
    order: [['id', 'DESC']]
  });
}

async function findById(id) {
  return Suscripcion.findByPk(id, {
    include: [
      { model: Plan, as: 'plan' },
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
    ]
  });
}

async function findActivaByUsuarioId(usuario_id) {
  return Suscripcion.findOne({
    where: { usuario_id, estado: 'activa' },
    include: [{ model: Plan, as: 'plan' }]
  });
}

async function findByUsuarioId(usuario_id) {
  return Suscripcion.findAll({
    where: { usuario_id },
    include: [{ model: Plan, as: 'plan' }],
    order: [['id', 'DESC']]
  });
}

async function updateById(id, data) {
  const suscripcion = await Suscripcion.findByPk(id);
  if (!suscripcion) return null;
  await suscripcion.update(data);
  return suscripcion;
}

async function findVencidas() {
  const hoy = new Date().toISOString().split('T')[0];
  return Suscripcion.findAll({
    where: { estado: 'activa', fecha_fin: { [Op.lt]: hoy } }
  });
}

module.exports = {
  create,
  findAll,
  findById,
  findActivaByUsuarioId,
  findByUsuarioId,
  updateById,
  findVencidas
};

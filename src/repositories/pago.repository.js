const { Pago, Usuario, Suscripcion } = require('../models');

async function create(data) {
  return Pago.create(data);
}

async function findAll() {
  return Pago.findAll({
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
      { model: Suscripcion, as: 'suscripcion' }
    ],
    order: [['id', 'DESC']]
  });
}

async function findById(id) {
  return Pago.findByPk(id, {
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
      { model: Suscripcion, as: 'suscripcion' }
    ]
  });
}

async function findByUsuarioId(usuario_id) {
  return Pago.findAll({
    where: { usuario_id },
    include: [{ model: Suscripcion, as: 'suscripcion' }],
    order: [['id', 'DESC']]
  });
}

async function updateById(id, data) {
  const pago = await Pago.findByPk(id);
  if (!pago) return null;
  await pago.update(data);
  return pago;
}

module.exports = { create, findAll, findById, findByUsuarioId, updateById };

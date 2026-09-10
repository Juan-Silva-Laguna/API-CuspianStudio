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

async function reporteVentas({ fecha_inicio, fecha_fin } = {}) {
  const { fn, col, Op } = require('sequelize');
  const where = { estado: 'completado' };
  if (fecha_inicio || fecha_fin) {
    where.fecha_pago = {};
    if (fecha_inicio) where.fecha_pago[Op.gte] = new Date(fecha_inicio);
    if (fecha_fin) where.fecha_pago[Op.lte] = new Date(fecha_fin + 'T23:59:59');
  }
  const result = await Pago.findOne({
    where,
    attributes: [
      [fn('SUM', col('monto')), 'total_ingresos'],
      [fn('COUNT', col('id')), 'total_pagos']
    ]
  });
  const detalles = await Pago.findAll({
    where,
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }],
    order: [['fecha_pago', 'DESC']]
  });
  return {
    total_ingresos: parseFloat(result.get('total_ingresos') || 0),
    total_pagos: parseInt(result.get('total_pagos') || 0),
    detalles
  };
}

module.exports = { create, findAll, findById, findByUsuarioId, updateById, reporteVentas };

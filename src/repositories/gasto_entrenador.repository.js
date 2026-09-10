const { GastoEntrenador, Entrenador, Usuario } = require('../models');

async function create(data) {
  return GastoEntrenador.create(data);
}

async function findAll() {
  return GastoEntrenador.findAll({
    include: [
      {
        model: Entrenador,
        as: 'entrenador',
        include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }]
      }
    ],
    order: [['fecha_pago', 'DESC']]
  });
}

async function findByEntrenadorId(entrenador_id) {
  return GastoEntrenador.findAll({
    where: { entrenador_id },
    order: [['fecha_pago', 'DESC']]
  });
}

async function findById(id) {
  return GastoEntrenador.findByPk(id);
}

async function sumByEntrenadorId(entrenador_id) {
  const { fn, col } = require('sequelize');
  const result = await GastoEntrenador.findOne({
    where: { entrenador_id },
    attributes: [[fn('SUM', col('monto')), 'total']]
  });
  return result ? parseFloat(result.get('total') || 0) : 0;
}

module.exports = { create, findAll, findByEntrenadorId, findById, sumByEntrenadorId };

const { Plan } = require('../models');

async function create(data) {
  return Plan.create(data);
}

async function findAll() {
  return Plan.findAll({ order: [['precio', 'ASC']] });
}

async function findById(id) {
  return Plan.findByPk(id);
}

async function updateById(id, data) {
  const plan = await Plan.findByPk(id);
  if (!plan) return null;
  await plan.update(data);
  return plan;
}

async function deleteById(id) {
  const plan = await Plan.findByPk(id);
  if (!plan) return null;
  await plan.destroy();
  return plan;
}

module.exports = { create, findAll, findById, updateById, deleteById };

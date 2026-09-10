const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Plan = sequelize.define(
  'Plan',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    clases_por_mes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'NULL = ilimitado'
    },
    invitados_por_mes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { tableName: 'planes', timestamps: true }
);

module.exports = Plan;

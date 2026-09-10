const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Suscripcion = sequelize.define(
  'Suscripcion',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    plan_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
    estado: {
      type: DataTypes.ENUM('activa', 'inactiva', 'vencida'),
      allowNull: false,
      defaultValue: 'inactiva'
    },
    clases_usadas_mes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    pagado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  { tableName: 'suscripciones', timestamps: true }
);

module.exports = Suscripcion;

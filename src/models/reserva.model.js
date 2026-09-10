const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reserva = sequelize.define(
  'Reserva',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    horario_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    estado: {
      type: DataTypes.ENUM('confirmada', 'cancelada', 'asistio'),
      allowNull: false,
      defaultValue: 'confirmada'
    }
  },
  { tableName: 'reservas', timestamps: true }
);

module.exports = Reserva;

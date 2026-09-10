const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sala = sequelize.define(
  'Sala',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    capacidad_maxima: { type: DataTypes.INTEGER, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: {
      type: DataTypes.ENUM('activa', 'inactiva'),
      allowNull: false,
      defaultValue: 'activa'
    }
  },
  { tableName: 'salas', timestamps: true }
);

module.exports = Sala;

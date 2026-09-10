const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Entrenador = sequelize.define(
  'Entrenador',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    especialidades: { type: DataTypes.TEXT, allowNull: true },
    biografia: { type: DataTypes.TEXT, allowNull: true },
    certificaciones: { type: DataTypes.TEXT, allowNull: true }
  },
  { tableName: 'entrenadores', timestamps: true }
);

module.exports = Entrenador;

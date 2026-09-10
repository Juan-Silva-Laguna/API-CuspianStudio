const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Horario = sequelize.define(
  'Horario',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    servicio_id: { type: DataTypes.INTEGER, allowNull: false },
    sala_id: { type: DataTypes.INTEGER, allowNull: false },
    entrenador_id: { type: DataTypes.INTEGER, allowNull: false },
    dia_semana: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 6 },
      comment: '0=Domingo, 1=Lunes, ..., 6=Sabado'
    },
    hora_inicio: { type: DataTypes.TIME, allowNull: false },
    hora_fin: { type: DataTypes.TIME, allowNull: false },
    cupo_maximo: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo'
    }
  },
  { tableName: 'horarios', timestamps: true }
);

module.exports = Horario;

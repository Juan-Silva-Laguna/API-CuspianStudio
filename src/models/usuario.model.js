const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: true },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true },
    foto_perfil: { type: DataTypes.STRING, allowNull: true },
    codigo_qr: { type: DataTypes.STRING, allowNull: true, unique: true },
    rol: {
      type: DataTypes.ENUM('admin', 'cliente', 'entrenador'),
      allowNull: false,
      defaultValue: 'cliente'
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo'
    }
  },
  { tableName: 'usuarios', timestamps: true }
);

module.exports = Usuario;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GastoEntrenador = sequelize.define(
  'GastoEntrenador',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    entrenador_id: { type: DataTypes.INTEGER, allowNull: false },
    concepto: { type: DataTypes.STRING, allowNull: false },
    monto: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    metodo_pago: {
      type: DataTypes.ENUM('efectivo', 'transferencia', 'tarjeta', 'otro'),
      allowNull: false,
      defaultValue: 'efectivo'
    },
    fecha_pago: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    notas: { type: DataTypes.TEXT, allowNull: true }
  },
  { tableName: 'gastos_entrenador', timestamps: true }
);

module.exports = GastoEntrenador;

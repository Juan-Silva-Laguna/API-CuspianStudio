const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pago = sequelize.define(
  'Pago',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    suscripcion_id: { type: DataTypes.INTEGER, allowNull: true },
    concepto: { type: DataTypes.STRING, allowNull: false },
    monto: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    metodo_pago: {
      type: DataTypes.ENUM('efectivo', 'transferencia', 'tarjeta', 'otro'),
      allowNull: false,
      defaultValue: 'efectivo'
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completado', 'fallido'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    fecha_pago: { type: DataTypes.DATE, allowNull: true }
  },
  { tableName: 'pagos', timestamps: true }
);

module.exports = Pago;

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'pagos';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((t) => (typeof t === 'string' ? t : t.tableName));
    if (normalized.includes(tableName)) return;

    await queryInterface.createTable(tableName, {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      suscripcion_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'suscripciones', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      concepto: { type: Sequelize.STRING, allowNull: false },
      monto: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      metodo_pago: {
        type: Sequelize.ENUM('efectivo', 'transferencia', 'tarjeta', 'otro'),
        allowNull: false,
        defaultValue: 'efectivo'
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'completado', 'fallido'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      fecha_pago: { type: Sequelize.DATE, allowNull: true },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    const tableName = 'pagos';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((t) => (typeof t === 'string' ? t : t.tableName));
    if (!normalized.includes(tableName)) return;
    await queryInterface.dropTable(tableName);
  }
};

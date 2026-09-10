'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'reservas';
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
      horario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'horarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fecha: { type: Sequelize.DATEONLY, allowNull: false, comment: 'Fecha exacta de la clase' },
      estado: {
        type: Sequelize.ENUM('confirmada', 'cancelada', 'asistio'),
        allowNull: false,
        defaultValue: 'confirmada'
      },
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
    const tableName = 'reservas';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((t) => (typeof t === 'string' ? t : t.tableName));
    if (!normalized.includes(tableName)) return;
    await queryInterface.dropTable(tableName);
  }
};

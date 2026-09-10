'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'salas';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((t) => (typeof t === 'string' ? t : t.tableName));
    if (normalized.includes(tableName)) return;

    await queryInterface.createTable(tableName, {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      capacidad_maxima: { type: Sequelize.INTEGER, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      estado: {
        type: Sequelize.ENUM('activa', 'inactiva'),
        allowNull: false,
        defaultValue: 'activa'
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
    const tableName = 'salas';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((t) => (typeof t === 'string' ? t : t.tableName));
    if (!normalized.includes(tableName)) return;
    await queryInterface.dropTable(tableName);
  }
};

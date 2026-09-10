'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'usuarios';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((table) =>
      typeof table === 'string' ? table : table.tableName
    );

    if (normalized.includes(tableName)) {
      return;
    }

    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rol: {
        type: Sequelize.ENUM('admin', 'cliente'),
        allowNull: false,
        defaultValue: 'cliente'
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
    const tableName = 'usuarios';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((table) =>
      typeof table === 'string' ? table : table.tableName
    );

    if (!normalized.includes(tableName)) {
      return;
    }

    await queryInterface.dropTable(tableName);
  }
};

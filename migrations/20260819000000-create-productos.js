'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'productos';
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
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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
    const tableName = 'productos';
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

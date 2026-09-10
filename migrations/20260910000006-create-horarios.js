'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'horarios';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((t) => (typeof t === 'string' ? t : t.tableName));
    if (normalized.includes(tableName)) return;

    await queryInterface.createTable(tableName, {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      servicio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'servicios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      sala_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'salas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      entrenador_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'entrenadores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      dia_semana: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '0=Domingo, 1=Lunes, ..., 6=Sabado'
      },
      hora_inicio: { type: Sequelize.TIME, allowNull: false },
      hora_fin: { type: Sequelize.TIME, allowNull: false },
      cupo_maximo: { type: Sequelize.INTEGER, allowNull: false },
      estado: {
        type: Sequelize.ENUM('activo', 'inactivo'),
        allowNull: false,
        defaultValue: 'activo'
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
    const tableName = 'horarios';
    const allTables = await queryInterface.showAllTables();
    const normalized = allTables.map((t) => (typeof t === 'string' ? t : t.tableName));
    if (!normalized.includes(tableName)) return;
    await queryInterface.dropTable(tableName);
  }
};

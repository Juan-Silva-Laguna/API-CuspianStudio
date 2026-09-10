'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('productos', [
      {
        nombre: 'Teclado mecánico',
        descripcion: 'Teclado mecánico retroiluminado con switches azules',
        precio: 45999.99,
        createdAt: now,
        updatedAt: now
      },
      {
        nombre: 'Mouse inalámbrico',
        descripcion: 'Mouse ergonómico con conexión Bluetooth',
        precio: 15999.5,
        createdAt: now,
        updatedAt: now
      },
      {
        nombre: 'Monitor 24 pulgadas',
        descripcion: 'Monitor Full HD con panel IPS',
        precio: 129999.0,
        createdAt: now,
        updatedAt: now
      },
      {
        nombre: 'Auriculares USB',
        descripcion: 'Auriculares con micrófono para videollamadas',
        precio: 22999.0,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('productos', null, {});
  }
};

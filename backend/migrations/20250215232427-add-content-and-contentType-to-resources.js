'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Usuń kolumnę 'content', jeśli istnieje
    try {
      await queryInterface.removeColumn('Resources', 'content');
      console.log('Kolumna "content" usunięta.');
    } catch (error) {
      console.log('Kolumna "content" nie istnieje, kontynuuję.');
    }
    // Usuń kolumnę 'contentType', jeśli istnieje
    try {
      await queryInterface.removeColumn('Resources', 'contentType');
      console.log('Kolumna "contentType" usunięta.');
    } catch (error) {
      console.log('Kolumna "contentType" nie istnieje, kontynuuję.');
    }

    // Dodaj nowe kolumny
    await queryInterface.addColumn('Resources', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    console.log('Kolumna "content" dodana.');

    await queryInterface.addColumn('Resources', 'contentType', {
      type: Sequelize.ENUM('link', 'text', 'video', 'pdf', 'audio'),
      allowNull: false,
      defaultValue: 'link',
    });
    console.log('Kolumna "contentType" dodana.');
  },

  down: async (queryInterface, Sequelize) => {
    // Usuń nowe kolumny przy rollbacku
    try {
      await queryInterface.removeColumn('Resources', 'content');
      console.log('Kolumna "content" usunięta (rollback).');
    } catch (error) {
      console.log('Kolumna "content" nie istnieje podczas rollbacku.');
    }
    try {
      await queryInterface.removeColumn('Resources', 'contentType');
      console.log('Kolumna "contentType" usunięta (rollback).');
    } catch (error) {
      console.log('Kolumna "contentType" nie istnieje podczas rollbacku.');
    }
  },
};

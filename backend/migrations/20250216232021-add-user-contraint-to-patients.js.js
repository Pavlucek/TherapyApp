'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sprawdź, czy kolumna już istnieje
    const tableDefinition = await queryInterface.describeTable('DiscussionBoards');
    if (!tableDefinition.attachment) {
      await queryInterface.addColumn('DiscussionBoard', 'attachment', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('Kolumna "attachment" została dodana.');
    } else {
      console.log('Kolumna "attachment" już istnieje. Pomijam migrację.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('DiscussionBoard');
    if (tableDefinition.attachment) {
      await queryInterface.removeColumn('DiscussionBoard', 'attachment');
      console.log('Kolumna "attachment" została usunięta.');
    }
  },
};

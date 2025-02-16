'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('journal_entry_tags', {
      journalEntryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'journal_entries', // nazwa tabeli
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
      // jeżeli chcesz dodać jakieś timestampy, musiałbyś je dopisać,
      // ale w modelu JournalEntryTag jest timestamps: false, więc nie dodajemy
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('journal_entry_tags');
  },
};

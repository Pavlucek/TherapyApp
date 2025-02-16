'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('journal_entries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'patients', // Upewnij się, że nazwa tabeli to 'patients'
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mood: {
        type: Sequelize.TINYINT, // SQLite i tak potraktuje to jako INTEGER
        allowNull: true,
      },
      tags: {
        // JSON przechowywany w polu TEXT
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.BLOB,
        allowNull: true,
      },
      audio: {
        type: Sequelize.BLOB,
        allowNull: true,
      },
      // timestamps
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      // jeżeli używasz paranoid: true -> dodałbyś tutaj deletedAt
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('journal_entries');
  },
};

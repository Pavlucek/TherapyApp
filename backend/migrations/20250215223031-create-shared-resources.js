'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SharedResources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Patients', // upewnij się, że nazwa tabeli jest zgodna z Twoim modelem
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Resources', // upewnij się, że nazwa tabeli jest zgodna z Twoim modelem
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Nie dodajemy kolumn createdAt/updatedAt, ponieważ timestamps: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SharedResources');
  },
};

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Usuwamy istniejącą tabelę Sessions, jeśli istnieje
    await queryInterface.dropTable('Sessions');

    // Tworzymy tabelę Sessions od nowa według definicji modelu
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      therapist_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Therapists',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'completed', 'cancelled', 'pending'),
        defaultValue: 'pending',
      },
      notes: {
        type: Sequelize.TEXT,
      },
      location: {
        type: Sequelize.STRING,
      },
      meetingLink: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,
        // Możesz dodać walidację po stronie modelu, ale w migracji wystarczy określić typ
      },
      feedback: {
        type: Sequelize.TEXT,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Usuwamy tabelę Sessions
    await queryInterface.dropTable('Sessions');
  },
};

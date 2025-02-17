'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Aktualizujemy rekordy z NULL dla patient_id
    await queryInterface.sequelize.query(`
      UPDATE Sessions
      SET patient_id = (SELECT id FROM Patients LIMIT 1)
      WHERE patient_id IS NULL;
    `);

    // Aktualizujemy rekordy z NULL dla therapist_id
    await queryInterface.sequelize.query(`
      UPDATE Sessions
      SET therapist_id = (SELECT id FROM Therapists LIMIT 1)
      WHERE therapist_id IS NULL;
    `);

    // Teraz zmieniamy kolumny na NOT NULL
    await queryInterface.changeColumn('Sessions', 'patient_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('Sessions', 'therapist_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Therapists',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Sessions', 'patient_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Patients',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('Sessions', 'therapist_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Therapists',
        key: 'id',
      },
    });
  },
};

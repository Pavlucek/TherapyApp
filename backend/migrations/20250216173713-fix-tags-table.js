'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Usunięcie starej tabeli, jeśli istnieje (opcjonalne, jeśli chcesz zacząć od nowa)
    await queryInterface.dropTable('tags');

    // Tworzenie nowej, poprawionej tabeli tags
    await queryInterface.createTable('tags', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('WEATHER', 'ACTIVITY', 'CATEGORY', 'LOCATION', 'OTHER'),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_global: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = prywatny tag pacjenta, true = globalny tag
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // NULL oznacza, że tag jest globalny
        references: {
          model: 'patients',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Dodanie unikalnego indeksu dla kombinacji (type, name, patient_id)
    await queryInterface.addConstraint('tags', {
      fields: ['type', 'name', 'patient_id'],
      type: 'unique',
      name: 'unique_type_name_patient',
    });
  },

  async down(queryInterface, Sequelize) {
    // Najpierw usuwamy indeks, potem tabelę
    await queryInterface.removeConstraint('tags', 'unique_type_name_patient');
    await queryInterface.dropTable('tags');
  },
};

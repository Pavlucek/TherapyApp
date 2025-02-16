'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Dodaj kolumnę is_global (czy tag jest globalny)
    await queryInterface.addColumn('tags', 'is_global', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Dodaj kolumnę patient_id (jeśli tag jest prywatny, to przypisany do pacjenta)
    await queryInterface.addColumn('tags', 'patient_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // null = tag globalny
      references: {
        model: 'patients',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Dodanie unikalnego indeksu dla kombinacji (type, name, patient_id)
    await queryInterface.addConstraint('tags', {
      fields: ['type', 'name', 'patient_id'],
      type: 'unique',
      name: 'unique_type_name_patient',
    });
  },

  async down(queryInterface, Sequelize) {
    // Usuń unikalny indeks przed usunięciem kolumn
    await queryInterface.removeConstraint('tags', 'unique_type_name_patient');
    await queryInterface.removeColumn('tags', 'is_global');
    await queryInterface.removeColumn('tags', 'patient_id');
  },
};

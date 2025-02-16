'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Dodaj kolumnę text
    await queryInterface.addColumn('reflections', 'text', {
      type: Sequelize.TEXT,
      allowNull: false,
      // jeśli chcesz, możesz ustawić:
      // defaultValue: '',
      // lub inny domyślny tekst
    });

    // 2) Dodaj kolumnę reflectionDate
    await queryInterface.addColumn('reflections', 'reflectionDate', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
      // Uwaga: W SQLite defaultValue: Sequelize.NOW jest interpretowane
      // dość luźno, ale pozwoli ustawić aktualny czas przy tworzeniu rekordu.
    });
  },

  async down(queryInterface, Sequelize) {
    // Cofnięcie zmian -> usunięcie dodanych kolumn
    await queryInterface.removeColumn('reflections', 'text');
    await queryInterface.removeColumn('reflections', 'reflectionDate');
  },
};

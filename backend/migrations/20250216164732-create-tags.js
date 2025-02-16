'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        // Sequelize w SQLite emuluje ENUM (przechowuje jako TEXT + walidacja)
        type: Sequelize.ENUM('WEATHER', 'ACTIVITY', 'CATEGORY', 'LOCATION', 'OTHER'),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // timestamps: false w modelu => tu też brak kolumn createdAt/updatedAt
    });

    // Dodajemy unikalny indeks do pary (type, name)
    await queryInterface.addIndex('tags', ['type', 'name'], {
      unique: true,
      name: 'tags_type_name_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    // Najpierw usuwamy indeks
    await queryInterface.removeIndex('tags', 'tags_type_name_unique');
    // W Postgres trzeba by ew. dropnąć typ ENUM, w SQLite wystarczy:
    await queryInterface.dropTable('tags');
  },
};

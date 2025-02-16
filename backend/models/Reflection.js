// models/Reflection.js
module.exports = (sequelize, DataTypes) => {
    const Reflection = sequelize.define('Reflection', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reflectionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      entryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'journal_entries',  // nazwa tabeli
          key: 'id',                  // klucz w tabeli JournalEntry
        },
        onDelete: 'CASCADE',         // albo inne reguły
        onUpdate: 'CASCADE',
      },
    }, {
      tableName: 'reflections',
      timestamps: true,
    });

    return Reflection;
  };

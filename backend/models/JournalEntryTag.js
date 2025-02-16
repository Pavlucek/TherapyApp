// models/JournalEntryTag.js

module.exports = (sequelize, DataTypes) => {
    const JournalEntryTag = sequelize.define(
      'JournalEntryTag',
      {
        journalEntryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'journal_entries', // fizyczna nazwa tabeli w bazie
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        tagId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'tags',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        // opcjonalnie możesz tu dodać dodatkowe pola
        // np. dateAssigned, assignedBy itp.
      },
      {
        tableName: 'journal_entry_tags',
        timestamps: false, // nie potrzebujemy createdAt/updatedAt
      }
    );

    return JournalEntryTag;
  };

// models/JournalEntry.js
module.exports = (sequelize, DataTypes) => {
  const JournalEntry = sequelize.define(
    'JournalEntry',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [1, 255],
            msg: 'Tytuł musi mieć co najmniej 1 znak i maksymalnie 255.',
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mood: {
        type: DataTypes.TINYINT,
        allowNull: true,
        validate: {
          min: 1,
          max: 10,
        },
      },
      tags: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('tags');
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue('tags', JSON.stringify(value));
        },
      },
      image: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      audio: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      shared: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'journal_entries',
      timestamps: true,
    }
  );

  return JournalEntry;
};

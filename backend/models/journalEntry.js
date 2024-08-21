module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'JournalEntry',
    {
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Patients',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.TEXT,
      },
      time: {
        type: DataTypes.TEXT,
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
      },
      mood: {
        type: DataTypes.INTEGER,
      },
      tags: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.BLOB,
      },
      audio: {
        type: DataTypes.BLOB,
      },
      category: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      weather: {
        type: DataTypes.STRING,
      },
      activity: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    },
  );
};

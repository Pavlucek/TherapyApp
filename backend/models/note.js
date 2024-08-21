module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Note',
    {
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Patients',
          key: 'id',
        },
      },
      therapist_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Therapists',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.TEXT,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      goals: {
        type: DataTypes.TEXT,
      },
      techniques: {
        type: DataTypes.TEXT,
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      attachments: {
        type: DataTypes.BLOB,
      },
    },
    {
      timestamps: false,
    },
  );
};

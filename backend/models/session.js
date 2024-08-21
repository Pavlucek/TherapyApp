module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Session',
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
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    },
  );
};

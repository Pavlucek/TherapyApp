module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'MedicalHistory',
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
      physical_health: {
        type: DataTypes.TEXT,
      },
      chronic_diseases: {
        type: DataTypes.TEXT,
      },
      allergies: {
        type: DataTypes.TEXT,
      },
      medications: {
        type: DataTypes.TEXT,
      },
      surgical_history: {
        type: DataTypes.TEXT,
      },
      family_medical_history: {
        type: DataTypes.TEXT,
      },
      current_symptoms: {
        type: DataTypes.TEXT,
      },
      lifestyle: {
        type: DataTypes.TEXT,
      },
      psychological_history: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    },
  );
};

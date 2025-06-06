module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Session',
    {
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ustawione jako wymagane
        references: {
          model: 'Patients',
          key: 'id',
        },
      },
      therapist_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ustawione jako wymagane
        references: {
          model: 'Therapists',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'pending'),
        defaultValue: 'pending',
      },
      notes: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.STRING,
      },
      meetingLink: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
      },
      feedback: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    },
  );
};

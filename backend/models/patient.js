module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Patient',
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATE,
      },
      contact: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      medical_history: {
        type: DataTypes.TEXT,
      },
      gender: {
        type: DataTypes.STRING,
      },
      emergency_contact: {
        type: DataTypes.STRING,
      },
      journal_access: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    },
  );
};

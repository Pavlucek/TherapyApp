module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'DiscussionBoard',
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
      sender: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
      attachment: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    },
  );
};

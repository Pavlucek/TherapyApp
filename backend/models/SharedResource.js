module.exports = (sequelize, DataTypes) => {
  const SharedResource = sequelize.define(
    'SharedResource',
    {
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Patients',
          key: 'id',
        },
      },
      resource_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Resources',
          key: 'id',
        },
      },
      // Opcjonalnie pole do śledzenia statusu
      viewed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return SharedResource;
};

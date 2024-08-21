module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Resource',
    {
      therapist_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Therapists',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    },
  );
};

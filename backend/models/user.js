module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['therapist', 'patient', 'admin']],
        },
      },
      therapist_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    },
  );
};

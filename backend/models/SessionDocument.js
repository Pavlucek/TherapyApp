module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'SessionDocument',
      {
        session_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Session', // upewnij się, że nazwa modelu odpowiada Twojej definicji
            key: 'id',
          },
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        dueDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        submitted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        feedback: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      },
    );
  };

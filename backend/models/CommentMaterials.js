// models/Comment.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'CommentMaterials',
    {
      resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Resources',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};

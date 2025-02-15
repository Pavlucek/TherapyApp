// models/Favorite.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'FavoriteMaterials',
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
      },
      {
        timestamps: false,
      }
    );
  };

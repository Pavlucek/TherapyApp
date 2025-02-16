module.exports = (sequelize, DataTypes) => {
    const SessionResource = sequelize.define(
      'SessionResource',
      {
        session_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Sessions', // Upewnij się, że nazwa modelu jest zgodna z Twoją definicją sesji
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
        // Opcjonalnie możesz dodać pole np. do oznaczenia, czy materiał został już obejrzany/przeczytany
        completed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        timestamps: false,
      },
    );

    return SessionResource;
  };

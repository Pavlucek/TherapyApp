// models/Tag.js
module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define(
      'Tag',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: DataTypes.ENUM('WEATHER', 'ACTIVITY', 'CATEGORY', 'LOCATION', 'OTHER'),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // Określa, czy tag jest globalny (widoczny dla wszystkich)
        is_global: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false, // domyślnie tagi są prywatne
        },
        // Jeśli tag nie jest globalny, jest przypisany do pacjenta
        patient_id: {
          type: DataTypes.INTEGER,
          allowNull: true, // null = globalny tag
          references: {
            model: 'Patients',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      {
        tableName: 'tags',
        timestamps: true,
        indexes: [
          // Pacjent może mieć unikalne tagi, ale globalne mogą się powtarzać
          {
            unique: true,
            fields: ['type', 'name', 'patient_id'],
          },
        ],
      }
    );

    return Tag;
};

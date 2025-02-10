module.exports = (sequelize, DataTypes) => {
    const SharedResource = sequelize.define('SharedResource', {
        patient_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Patients',  // Zmieniamy na liczbę mnogą
            key: 'id',
        },
        },
        resource_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Resources',  // Zmieniamy na liczbę mnogą
            key: 'id',
        },
        },
    });
  
    return SharedResource;
  };
  
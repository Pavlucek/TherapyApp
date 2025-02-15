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
      // Nowe pole na treść, np. artykuł lub inny materiał tekstowy
      content: {
        type: DataTypes.TEXT,
        allowNull: true,  // materiał może mieć link lub treść, więc pole jest opcjonalne
      },
      // Pole określające typ treści – ograniczone do kilku wartości
      contentType: {
        type: DataTypes.ENUM('link', 'text', 'video', 'pdf', 'audio'),
        allowNull: false,
        defaultValue: 'link', // domyślnie 'link'
      },
    },
    {
      timestamps: false,
    },
  );
};

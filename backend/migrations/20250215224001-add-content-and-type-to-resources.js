'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Resources', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Resources', 'contentType', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'link',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Resources', 'content');
    await queryInterface.removeColumn('Resources', 'contentType');
  },
};

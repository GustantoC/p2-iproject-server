'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MangaUsers', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please input type'
        }
      }
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MangaUsers', 'type');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

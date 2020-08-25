'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Leaderboards_Activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mapUid: {
        type: Sequelize.STRING
      },
      accountId: {
        type: Sequelize.STRING
      },
      oldScore: {
        type: Sequelize.INTEGER
      },
      newScore: {
        type: Sequelize.INTEGER
      },
      oldPosition: {
        type: Sequelize.INTEGER
      },
      newPosition: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Leaderboards_Activities');
  }
};
'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Leaderboards', 'closed', {
            type: Sequelize.BOOLEAN,
        })
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeColumn('Leaderboards', 'closed')
    },
}

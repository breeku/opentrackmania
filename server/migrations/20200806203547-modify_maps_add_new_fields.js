'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('Maps', 'map', 'mapUid')
        await queryInterface.addColumn('Maps', 'mapId', {
            type: Sequelize.STRING,
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
        await queryInterface.renameColumn('Maps', 'mapUid', 'map')
        await queryInterface.removeColumn('Maps', 'mapId')
    },
}

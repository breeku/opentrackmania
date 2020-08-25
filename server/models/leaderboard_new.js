/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class leaderboard_new extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Maps, { foreignKey: 'mapUid', targetKey: 'mapUid' })
            this.belongsTo(models.Users, {
                foreignKey: 'accountId',
                targetKey: 'accountId',
            })
        }
    }
    leaderboard_new.init(
        {
            mapUid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            accountId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            closed: DataTypes.BOOLEAN,
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ghost: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'leaderboard_new',
        },
    )
    return leaderboard_new
}

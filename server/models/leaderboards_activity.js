/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Leaderboards_Activity extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Leaderboards, {
                foreignKey: 'mapUid',
                targetKey: 'mapUid',
            })
            this.belongsTo(models.Users, {
                foreignKey: 'accountId',
                targetKey: 'accountId',
            })
        }
    }
    Leaderboards_Activity.init(
        {
            mapUid: DataTypes.STRING,
            accountId: DataTypes.STRING,
            oldScore: DataTypes.INTEGER,
            newScore: DataTypes.INTEGER,
            oldPosition: DataTypes.INTEGER,
            newPosition: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Leaderboards_Activity',
        },
    )
    return Leaderboards_Activity
}

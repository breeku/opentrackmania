/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Leaderboards extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Maps, {
                foreignKey: 'mapUid',
                targetKey: 'mapUid',
            })
        }
    }
    Leaderboards.init(
        {
            campaign: DataTypes.STRING,
            mapUid: DataTypes.STRING,
            closed: DataTypes.BOOLEAN,
            data: DataTypes.JSONB,
        },
        {
            sequelize,
            modelName: 'Leaderboards',
        },
    )
    return Leaderboards
}

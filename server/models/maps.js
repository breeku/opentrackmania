/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Maps extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasOne(models.Leaderboards, {
                foreignKey: 'mapUid',
                sourceKey: 'mapUid',
            })
            this.hasOne(models.Totds, {
                foreignKey: 'mapUid',
                sourceKey: 'mapUid',
            })
        }
    }
    Maps.init(
        {
            mapId: DataTypes.STRING,
            mapUid: DataTypes.STRING,
            data: DataTypes.JSONB,
            campaign: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Maps',
        },
    )
    return Maps
}

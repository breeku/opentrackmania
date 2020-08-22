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
            this.hasOne(models.Users, {
                foreignKey: 'accountId',
                sourceKey: 'accountId',
            })
        }
    }
    Maps.init(
        {
            mapId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mapUid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            data: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            campaign: DataTypes.STRING,
            accountId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            seasonUid: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Maps',
        },
    )
    return Maps
}

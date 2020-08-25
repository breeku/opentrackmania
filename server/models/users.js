/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Rankings, {
                foreignKey: 'accountId',
                sourceKey: 'accountId',
            })
            this.hasOne(models.Trophies, {
                foreignKey: 'accountId',
                sourceKey: 'accountId',
            })
            this.hasMany(models.Maps, {
                foreignKey: 'accountId',
                sourceKey: 'accountId',
            })
            this.hasMany(models.Leaderboards_Activity, {
                foreignKey: 'accountId',
                sourceKey: 'accountId',
            })
        }
    }
    Users.init(
        {
            nameOnPlatform: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            accountId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            clubId: DataTypes.INTEGER,
            clubName: DataTypes.STRING,
            tracking: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            twitch: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'Users',
        },
    )
    return Users
}

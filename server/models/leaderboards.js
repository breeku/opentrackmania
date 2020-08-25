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
            this.belongsTo(models.Maps, { foreignKey: 'mapUid', targetKey: 'mapUid' })
            this.hasMany(models.Leaderboards_Activity, {
                foreignKey: 'mapUid',
                sourceKey: 'mapUid',
            })
        }
    }
    Leaderboards.init(
        {
            mapUid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            closed: DataTypes.BOOLEAN,
            data: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Leaderboards',
        },
    )
    return Leaderboards
}

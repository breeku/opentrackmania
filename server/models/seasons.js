/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Seasons extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Seasons.init(
        {
            name: DataTypes.STRING,
            seasonUid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            leaderboardGroupUid: DataTypes.STRING,
            publishedDate: DataTypes.INTEGER,
            playlist: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Seasons',
        },
    )
    return Seasons
}

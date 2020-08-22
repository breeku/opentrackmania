/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Totds extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Maps, { foreignKey: 'mapUid', targetKey: 'mapUid' })
        }
    }
    Totds.init(
        {
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            month: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            day: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            mapUid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            seasonUid: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Totds',
        },
    )
    return Totds
}

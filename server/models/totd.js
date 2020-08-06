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
        }
    }
    Totds.init(
        {
            year: DataTypes.INTEGER,
            month: DataTypes.INTEGER,
            day: DataTypes.INTEGER,
            mapUid: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Totds',
        },
    )
    return Totds
}

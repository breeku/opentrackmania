/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Trophies extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Users, {
                foreignKey: 'accountId',
                targetKey: 'accountId',
            })
        }
    }
    Trophies.init(
        {
            accountId: DataTypes.STRING,
            data: DataTypes.JSONB,
        },
        {
            sequelize,
            modelName: 'Trophies',
        },
    )
    return Trophies
}

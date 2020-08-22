/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Rankings extends Model {
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
    Rankings.init(
        {
            accountId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            countPoint: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            echelon: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            zones: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Rankings',
        },
    )
    return Rankings
}

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rankings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Rankings.init({
    accountId: DataTypes.STRING,
    countPoint: DataTypes.INTEGER,
    echelon: DataTypes.INTEGER,
    zones: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Rankings',
  });
  return Rankings;
};
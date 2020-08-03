'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leaderboards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Leaderboards.init({
    campaign: DataTypes.STRING,
    map: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Leaderboards',
  });
  return Leaderboards;
};
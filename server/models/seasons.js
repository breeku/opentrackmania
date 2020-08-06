'use strict';
const {
  Model
} = require('sequelize');
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
  };
  Seasons.init({
    name: DataTypes.STRING,
    seasonUid: DataTypes.STRING,
    leaderboardGroupUid: DataTypes.STRING,
    publishedDate: DataTypes.INTEGER,
    playlist: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Seasons',
  });
  return Seasons;
};
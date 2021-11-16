'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MangaRead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MangaRead.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  };
  MangaRead.init({
    UserId: DataTypes.INTEGER,
    MalId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MangaRead',
  });
  return MangaRead;
};
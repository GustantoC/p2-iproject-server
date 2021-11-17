'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MangaUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MangaUser.belongsTo(models.User, { foreignKey: 'UserId' });
      // MangaUser.belongsTo(models.Manga, { uniqueKey: 'MalId' });
    }
  };
  MangaUser.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    MalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        checkPickedByUser(value, next) {
          MangaUser.findOne({ where: { UserId: this.UserId, MalId: value } })
            .then((data) => {
              if (data) {
                return next('User already picked this manga/anime');
              } else {
                return next()
              }
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }
    },
    type:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'MangaUser',
  });
  return MangaUser;
};
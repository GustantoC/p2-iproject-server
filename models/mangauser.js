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
      MangaUser.belongsTo(models.Anime, { foreignKey: 'animeId' });
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
    DexId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPickedByUser(value, next) {
          MangaUser.findOne({ where: { UserId: this.UserId, DexId: value } })
            .then((data) => {
              if (data) {
                return next('User already picked this manga');
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
    animeId: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'MangaUser',
  });
  return MangaUser;
};
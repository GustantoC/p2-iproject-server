'use strict';
const {
  Model
} = require('sequelize');
const HashingHelper = require('../helpers/HashingHelper')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Username already exists'
      },
      validate: {
        notEmpty: {
          msg: 'Please input username'
        },
        notNull: {
          msg: 'Please input username'
        },
        isAlphanumeric: {
          msg: 'Username can only contain letters and numbers'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please input password'
        },
        notNull: {
          msg: 'Please input password'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = HashingHelper.hashPassword(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
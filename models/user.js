'use strict';
const {
  Model
} = require('sequelize');
const HashingHelper = require('../helpers/hashing.helper');
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
          msg: 'Username cannot be empty'
        },
        notNull: {
          msg: 'Username cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        notNull: {
          msg: 'Password cannot be empty'
        },
        min: {
          args: [6],
          msg: 'Password must be more than 6 characters'
        }
      }
    },
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = HashingHelper.hash(user.password);
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
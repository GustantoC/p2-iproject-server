const { User, MangaUser } = require('../models')
const { OAuth2Client } = require('google-auth-library');
const HashingHelper = require('../helpers/HashingHelper')
const TokenHelper = require('../helpers/TokenHelper')

class AuthController {
  static async register(req, res, next) {
    try {
      if (!req.body.username || !req.body.password) {
        throw { name: "400", message: "Please input Username and Password" }
      }
      const { username, password } = req.body
      let userObj = { username, password }
      let result = await User.create(userObj)
      res.status(201).json({
        id: result.id,
        username: result.username
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      if (!req.body.username || !req.body.password) {
        throw { name: "400", message: "Please provide Username and Password" }
      }
      let passwordInput = req.body.password
      let user = await User.findOne(
        {
          where: {
            username: req.body.username
          }
        }
      )
      if (user && HashingHelper.comparePassword(passwordInput, user.password)) {
        let tokenPayload = { id: user.id, username: user.username, }
        let access_token = TokenHelper.signPayload(tokenPayload)
        res.status(200).json({ access_token })
      } else {
        throw { name: "401", message: "User or Password is Incorrect" }
      }
    } catch (err) {
      next(err)
    }
  }


}

module.exports = AuthController
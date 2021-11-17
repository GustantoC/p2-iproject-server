const { User, MangaUser } = require('../models')
const { OAuth2Client } = require('google-auth-library');
const HashingHelper = require('../helpers/HashingHelper')
const TokenHelper = require('../helpers/TokenHelper')

class AuthController {
  static async verifyGoogle(req, res, next) {
    try {
      let { id_token } = req.body
      let CLIENT_ID = process.env.GOOGLE_CLIENT_ID
      const client = new OAuth2Client(CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email } = payload
      let randomPass = (Math.random() + 1).toString(36).substring(2);
      const [response, isCreated] = await User.findOrCreate({
        where: {
          username: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')
        },
        defaults: {
          password: randomPass,
        }
      })
      let status = 200
      if (isCreated) {
        status = 201
      }
      const access_token = TokenHelper.signPayload({ id: response.id, username: response.username, email: response.email }, process.env.JWT_SIGNATURE)
      res.status(status).json({ access_token: access_token })
    } catch (error) {
      next(error)
    }
  }


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
        throw { name: "400", message: "User or Password is Incorrect" }
      }
    } catch (err) {
      next(err)
    }
  }

  static async verifyToken(req, res, next) {
    try {
      let { access_token } = req.headers;
      if (!access_token) {
        throw { name: "400", message: "Please provide an access_token" }
      }
      const payload = TokenHelper.verifyToken(access_token)
      const response = await User.findOne({ where: { username: payload.username } })
      if (!response) {
        throw { name: "404", message: "User not found" }
      }
      req.user = {
        id: response.id,
        username: response.username,
        email: response.email
      }
      res.status(200).json(req.user)
    } catch (err) {
      next(err);
    }
  }

}

module.exports = AuthController
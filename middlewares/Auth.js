const { User } = require('../models')
const jwt = require("../helpers/TokenHelper")

async function Auth(req, res, next) {
  try {
    let { access_token } = req.headers
    let response = jwt.verifyToken(access_token)
    if (!response) {
      throw { name: "401", message: null }
    }
    let getUser = await User.findOne({ where: { username: response.username } })
    if (!getUser) {
      throw { name: "401", message: "Invalid input/password" }
    }
    req.user = {
      id: getUser.id,
      username: getUser.username
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = Auth
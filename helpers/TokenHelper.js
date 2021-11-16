const jwt = require('jsonwebtoken')

class TokenHelper{
  static signPayload(payload){
    return jwt.sign(payload, process.env.SECRET_KEY)
  }
  static verifyToken(token){
    return jwt.verify(token, process.env.SECRET_KEY)
  }
}

module.exports = TokenHelper
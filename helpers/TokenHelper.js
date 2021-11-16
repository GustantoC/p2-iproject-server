const jwt = require('jsonwebtoken');

class TokenHelper {
  static signToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY);
  }
  static getPayload(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
  }
}

module.exports = TokenHelper;
const bcrypt = require('bcryptjs')

class HashingHelper{
  static hashPassword(password) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        return hash
      })
    })
  }
  static comparePassword(password, hash) {
    bcrypt.compare(password, hash, (err, res) => {
      return res
    })
  }
}

module.exports = HashingHelper
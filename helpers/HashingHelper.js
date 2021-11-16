const bcrypt = require('bcryptjs')

class HashingHelper{
  static hashPassword(password){
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  static comparePassword(password, hash){
    return bcrypt.compareSync(password, hash)
  }
}

module.exports = HashingHelper
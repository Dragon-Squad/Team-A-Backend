const User = require('./UserSchema');

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }
}

module.exports = new UserRepository();
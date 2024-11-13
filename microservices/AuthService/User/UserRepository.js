const User = require('./UserSchema');

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(data) {
    const user = new User(data);
    return await user.save();
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async isVerified(id) {
    const user = await User.findById(id);
    return user?.isVerified === true;
  }
}

module.exports = new UserRepository();
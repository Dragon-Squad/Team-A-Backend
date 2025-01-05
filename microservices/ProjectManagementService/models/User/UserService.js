const UserRepository = require('./UserRepository');
const bcrypt = require('bcryptjs');

class UserService {
  async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();
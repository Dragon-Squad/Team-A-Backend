const CharityRepository = require('./CharityRepository');

class CharityService {
  async searchByName(search) {
    return await CharityRepository.searchByName(search);
  }
}

module.exports = new CharityService();
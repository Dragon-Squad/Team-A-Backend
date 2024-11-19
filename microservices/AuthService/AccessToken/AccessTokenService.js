const accessTokenRepository = require('./AccessTokenRepository');

class AccessTokenService {
  async storeAccessToken(accessToken) {
    try {
      return await accessTokenRepository.storeAccessToken(accessToken);
    } catch (err) {
      console.error("Error in service while storing access token:", err);
      throw err;
    }
  }

  async hasAccessToken(accessToken) {
    try {
      const token = await accessTokenRepository.findAccessToken(accessToken);
      return !!token;
    } catch (err) {
      console.error("Error in service while checking access token:", err);
      throw err;
    }
  }

  async deleteAccessToken(accessToken) {
    try {
      return await accessTokenRepository.deleteAccessToken(accessToken);
    } catch (err) {
      console.error("Error in service while deleting access token:", err);
      throw err;
    }
  }
}

module.exports = new AccessTokenService();
const AccessToken = require('./AccessTokenSchema');

class AccessTokenRepository {
  async storeAccessToken(accessToken) {
    try {
      const tokenEntry = new AccessToken({ accessToken });
      await tokenEntry.save();
      return tokenEntry;
    } catch (err) {
      console.error("Error storing access token:", err);
      throw err;
    }
  }

  async findAccessToken(accessToken) {
    try {
      return await AccessToken.findOne({ accessToken });
    } catch (err) {
      console.error("Error finding access token:", err);
      throw err;
    }
  }

  async deleteAccessToken(accessToken) {
    try {
      return await AccessToken.deleteOne({ accessToken });
    } catch (err) {
      console.error("Error deleting access token:", err);
      throw err;
    }
  }
}

module.exports = new AccessTokenRepository();
require('dotenv').config();
const jwt = require("jsonwebtoken");
const { storeAccessToken } = require("../../AccessToken/AccessTokenService");

const generateToken = async (id, role) => {
  try {
    // Check if environment variables are set
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error(
        "Token secrets are not set in the environment variables.",
      );
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { id: id, role: role},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );


    // Store the access token in the database
    await storeAccessToken(accessToken);

    return accessToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = generateToken;
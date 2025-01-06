require("dotenv").config();
const { getUserById } = require('../models/User/UserService');
const { createPrivateKey } = require('crypto')
const { jwtDecrypt } = require('jose')
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return res.status(401).json({
      message: "No access token"
    });
  }

  const privateKey = createPrivateKey(process.env.JWE_PRIVATE_MW);

  try {
    const decrypted = await jwtDecrypt(accessToken, privateKey);
    const jws = decrypted.payload.jws;
    const decoded = jwt.verify(jws, process.env.JWS_PUBLIC_MW, { algorithm: 'RS256' });

    res.locals.id = decoded.userId;
    res.locals.role = decoded.userRole;

    next();
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Expired access token"
      });
    }
    return res.status(401).json({
      message: "Invalid access token"
    });
  }
}

const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { role } = res.locals;

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          message: "Insufficient permissions"
        });
      }

      const response = await fetch(`http://localhost:3010/user`, {
        headers: {
          "Cookie": `accessToken=${req.cookies.accessToken};refreshToken=${req.cookies.refreshToken}`
        }
      });

      if (!response.ok) {
        return res.status(403).json({
          message: "User not found"
        });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Authorization failed",
      });
    };
  }
}

module.exports = {
  authenticate,
  authorize,
};

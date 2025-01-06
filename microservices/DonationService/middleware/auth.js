require("dotenv").config();
const { createPrivateKey } = require('crypto')
const { jwtDecrypt } = require('jose')
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return res.status(401).json({
      message: "Unauthenticated"
    });
  }

  const privateKey = createPrivateKey(process.env.JWE_PRIVATE_MW);

  try {
    const decrypted = await jwtDecrypt(accessToken, privateKey);
    const jws = decrypted.payload.jws;
    const decoded = jwt.verify(jws, process.env.JWS_PUBLIC_MW, { algorithm: 'RS256' });

    res.userId = decoded.userId;
    res.userRole = decoded.userRole;
    req.accessToken = jws;
    
    next();
  } catch (error) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Expired access token! Please login Again!"
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
      const { userRole } = res;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Insufficient permissions"
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

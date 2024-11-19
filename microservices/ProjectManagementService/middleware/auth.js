const { setCookie } = require('./setCookie');
const { introspect } = require('./introspect');
const { getUserById } = require('../User/UserService');
const { hasAccessToken } = require("../AccessToken/AccessTokenService");

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken; 
  console.log("Access token: " + accessToken);

  try {
    // Check if refresh token exists
    if (!accessToken) {
      return res.status(403).json("FORBIDDEN: Authentication Invalid");
    }

    // Verify refresh token
    const payload = introspect(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!payload) {
      return res.status(401).json("UNAUTHORIZED: Invalid token");
    }

    // Get user by role
    const user = await getUserById(payload.id);
    const isValid = await hasAccessToken(accessToken);
    if (!user || !isValid ) {
      return res.status(403).json("FORBIDDEN: Authentication Invalid");
    }
    
    // Set new token cookies
    setCookie(res, accessToken);

    // Attach user information to the request
    req.id = payload.id;
    req.role = payload.role;

    next();
  } catch (err) {
    console.error(err);
    res
    .status(500)
    .json("INTERNAL SERVER ERROR");
  }
};

const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { id, role } = req;

      // Check if the current role is in the allowed roles
      if (allowedRoles.includes(role)) {
        const user = getUserById(id)

        if (user) {
          console.log("Grant Permission");

          req.id = id;
          req.role = role; 

          return next();
        }
      }

      res
        .status(403)
        .json("FORBIDDEN: You do not have the required permissions!");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json("INTERNAL SERVER ERROR");
    }
  };
};

module.exports = {
  authenticate,
  authorize,
};
const express = require("express");
const AuthRouter = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require('../User/enum/userType');
const {
  register,
  login,
  logout,
  verifyUser,
} = require("./AuthController");

// AuthRouter.post("/verify/:id", verifyUser);

AuthRouter.post("/new", register);

// AuthRouter.post(
//   "/new/admin", 
//   authenticate, 
//   authorize([UserType.ADMIN]), 
//   register
// );

AuthRouter.post("/login", login);

AuthRouter.delete("/logout", authenticate, logout);

module.exports = AuthRouter;
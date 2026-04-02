const express = require("express");
const authController = require("../controllers/auth.controller");
const identifyUser = require("../middleware/auth.middleware");

const authRouter = express.Router();

/** 
    Post /api/auth/register 
**/

authRouter.post("/register", authController.registerController);

/** 
    Post /api/auth/login 
**/
authRouter.post("/login", authController.loginController);

/**
 * @routes Get /api/auth/get-me
 * @desc Get current logged in user's info
 * @access Private
 */
authRouter.get("/get-me", identifyUser, authController.getMeController);

module.exports = authRouter;

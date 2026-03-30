const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser = require("../middleware/auth.middleware");

const userRouter = express.Router();

/* 
    @route POST /api/user/follow/:username
    @desc follow a user
    @access private
*/
userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followUserController,
);

/* 
    @route POST /api/user/unfollow/:username
    @desc unfollow a user
    @access private
*/
userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfolowUserController,
);

module.exports = userRouter;

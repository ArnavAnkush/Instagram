const express = require("express");
const followRouter = express.Router();
const followController = require("../controllers/follow.controller");
const identifyUser = require("../middleware/auth.middleware");

/*
 * @route POST /api/follow/request/:username
 * @desc  Send a follow request to a user (status = "pending")
 * @access private
 */
followRouter.post(
  "/request/:username",
  identifyUser,
  followController.sendFollowRequest
);

/*
 * @route PATCH /api/follow/accept/:username
 * @desc  Accept a pending follow request from :username
 * @access private (must be called by the followee)
 */
followRouter.patch(
  "/accept/:username",
  identifyUser,
  followController.acceptFollowRequest
);

/*
 * @route PATCH /api/follow/reject/:username
 * @desc  Reject a pending follow request from :username
 * @access private (must be called by the followee)
 */
followRouter.patch(
  "/reject/:username",
  identifyUser,
  followController.rejectFollowRequest
);

/*
 * @route GET /api/follow/pending
 * @desc  Get all pending follow requests for the logged-in user
 * @access private
 */
followRouter.get("/pending", identifyUser, followController.getPendingRequests);

module.exports = followRouter;

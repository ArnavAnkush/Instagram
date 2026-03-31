const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

/**
 * @desc  Send a follow request (status = "pending")
 * @route POST /api/follow/request/:username
 * @access private
 */
async function sendFollowRequest(req, res) {
  try {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    // Cannot send request to yourself
    if (followerUsername === followeeUsername) {
      return res.status(400).json({
        message: "You cannot send a follow request to yourself",
      });
    }

    // Check if target user exists
    const followeeExists = await userModel.findOne({ username: followeeUsername });
    if (!followeeExists) {
      return res.status(404).json({
        message: `User "${followeeUsername}" does not exist`,
      });
    }

    // Create the follow request — unique index will catch duplicates
    const followRequest = await followModel.create({
      follower: followerUsername,
      followee: followeeUsername,
      status: "pending",
    });

    return res.status(201).json({
      message: `Follow request sent to ${followeeUsername}`,
      followRequest,
    });
  } catch (err) {
    // Duplicate key error from MongoDB unique index on (follower, followee)
    if (err.code === 11000) {
      return res.status(409).json({
        message: "A follow request already exists for this user",
      });
    }
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

/**
 * @desc  Accept a pending follow request
 * @route PATCH /api/follow/accept/:username
 * @access private  (must be called by the followee)
 */
async function acceptFollowRequest(req, res) {
  try {
    const followeeUsername = req.user.username;
    const followerUsername = req.params.username;

    const request = await followModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "No pending follow request found from this user",
      });
    }

    request.status = "accepted";
    await request.save();

    return res.status(200).json({
      message: `You accepted the follow request from ${followerUsername}`,
      followRequest: request,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

/**
 * @desc  Reject a pending follow request
 * @route PATCH /api/follow/reject/:username
 * @access private  (must be called by the followee)
 */
async function rejectFollowRequest(req, res) {
  try {
    const followeeUsername = req.user.username;
    const followerUsername = req.params.username;

    const request = await followModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "No pending follow request found from this user",
      });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({
      message: `You rejected the follow request from ${followerUsername}`,
      followRequest: request,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

/**
 * @desc  Get all pending follow requests for the logged-in user
 * @route GET /api/follow/pending
 * @access private
 */
async function getPendingRequests(req, res) {
  try {
    const followeeUsername = req.user.username;

    const pendingRequests = await followModel.find({
      followee: followeeUsername,
      status: "pending",
    });

    return res.status(200).json({
      message: "Pending follow requests fetched successfully",
      count: pendingRequests.length,
      pendingRequests,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = {
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  getPendingRequests,
};

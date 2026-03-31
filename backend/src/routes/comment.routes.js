const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/comment.controller");
const identifyUser = require("../middleware/auth.middleware");

/*
 * @route POST /api/comment/:postId
 * @desc  Add a comment to a post
 * @access private
 */
commentRouter.post("/:postId", identifyUser, commentController.addComment);

/*
 * @route GET /api/comment/:postId
 * @desc  Get all comments for a post (newest first)
 * @access private
 */
commentRouter.get("/:postId", identifyUser, commentController.getComments);

/*
 * @route DELETE /api/comment/:commentId
 * @desc  Delete a comment (only the author can delete)
 * @access private
 */
commentRouter.delete(
  "/:commentId",
  identifyUser,
  commentController.deleteComment
);

module.exports = commentRouter;

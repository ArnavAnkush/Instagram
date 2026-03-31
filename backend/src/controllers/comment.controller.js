const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");

/**
 * @desc  Add a comment to a post
 * @route POST /api/comment/:postId
 * @access private
 */
async function addComment(req, res) {
  try {
    const postId = req.params.postId;
    const author = req.user.username;
    const { text } = req.body;

    // Validate text
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: "Comment text cannot be empty",
      });
    }

    // Check post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await commentModel.create({
      post: postId,
      author,
      text: text.trim(),
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

/**
 * @desc  Get all comments for a post (newest first)
 * @route GET /api/comment/:postId
 * @access private
 */
async function getComments(req, res) {
  try {
    const postId = req.params.postId;

    // Check post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await commentModel
      .find({ post: postId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Comments fetched successfully",
      count: comments.length,
      comments,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

/**
 * @desc  Delete a comment (only the author can delete)
 * @route DELETE /api/comment/:commentId
 * @access private
 */
async function deleteComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const requesterUsername = req.user.username;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Only the comment author can delete it
    if (comment.author !== requesterUsername) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }

    await commentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = {
  addComment,
  getComments,
  deleteComment,
};

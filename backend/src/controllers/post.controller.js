const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const postRouter = require("../routes/post.routes");
const likeModel = require("../models/like.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2-instagram-post",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({ message: "Post created successfully", post });
}

async function getPostsController(req, res) {
  const userId = req.user.id;
  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }
  if (post.user.toString() !== userId) {
    return res.status(403).json({
      message: "You are not authorized to access this post",
    });
  }
  res.status(200).json({
    message: "Post details fetched successfully",
    post,
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // ✅ check if already liked
  const isAlreadyLiked = await likeModel.findOne({
    post: postId,
    username: username,
  });

  if (isAlreadyLiked) {
    return res.status(200).json({
      message: "You have already liked this post",
      like: isAlreadyLiked,
    });
  }

  const like = await likeModel.create({
    post: postId,
    username: username,
  });

  res.status(201).json({
    message: "Post liked successfully",
    like,
  });
}

module.exports = {
  createPostController,
  getPostsController,
  getPostDetailsController,
  likePostController,
};

const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const identifyUser = require("../middleware/auth.middleware");

/*
* @routes POST /api/post [protected]
* @desc create a post with image and caption
* - req.body = {caption, img-file}

*/

postRouter.post("/", identifyUser, postController.createPostController);

/**
 * @routes GET /api/post/ [protected]
 * @desc return all the posts
 */

postRouter.get("/", identifyUser, postController.getPostsController);

/**
 * @routes Get /api/post/details/:postid
 * @desc return an detail about specific post with the id. Also check whether the post belongs to the user that the request is come from
 */

postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);

/**
 * @routes POST /api/post/like/:postId
 * @desc like a post
 * @access private
 */

postRouter.post(
  "/like/:postId",
  identifyUser,
  postController.likePostController,
);

module.exports = postRouter;

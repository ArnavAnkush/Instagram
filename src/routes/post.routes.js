const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const identifyUser = require("../middleware/auth.middleware");

/*
* Post /api/post [protected]
* - req.body = {caption, img-file}

*/

postRouter.post("/", identifyUser, postController.createPostController);

/**
 * Get /api/post/ [protected]
 */

postRouter.get("/", identifyUser, postController.getPostsController);

/**
 * Get /api/post/details/:postid
 * - return an detail about specific post with the id. Also check whether the post belongs to the user that the request is come from
 */

postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);

module.exports = postRouter;

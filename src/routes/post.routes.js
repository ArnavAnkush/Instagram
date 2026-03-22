const express = require("express")
const postRouter = express.Router()
const multer = require("multer")
const postController = require("../controllers/post.controller")

const upload = multer({storage: multer.memoryStorage()})

/*
* Post /api/post [protected]
* - req.body = {caption, img-file}

*/ 

postRouter.post("/", postController.createPostController)

/**
 * Get /api/post/ [protected]
 */

postRouter.get("/", postController.getPostsController)

/**
 * Get /api/post/details/:postid
 * - return an detail about specific post with the id. Also check whether the post belongs to the user that the request is come from
 */

postRouter.get("/details/:postId", postController.getPostDetailsController)

module.exports = postRouter
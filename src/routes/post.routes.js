const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")

/*
* Post /api/post [protected]
* - req.body = {caption, img-file}

*/ 

postRouter.post("/", postController.createPostController)

module.exports = postRouter
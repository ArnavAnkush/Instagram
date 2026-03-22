const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const postRouter = require("../routes/post.routes")


const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function createPostController(req, res){
    console.log(req.body, req.file)

    const token = req.cookies.token

    if (!token){
        return res.status(401).json({message: "Unauthorized access"})
    }

    let decoded = null

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({message: "user not authorized"})
    }
    
    console.log(decoded)

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder:"cohort-2-instagram-post"
    })
    
    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: decoded.id
    })

    res.status(201).json({message: "Post created successfully", post})
}

async function getPostsController(req, res){
    const token = req.cookies.token

    if (!token){
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }

    let decoded
    
    try{
        decoded =jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message: "Token invalid"
        })
    }
    const userId  = decoded.id
    const posts  = await postModel.find({
        user:userId 
    })

    res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })


}

async function getPostDetailsController(req, res){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message: "UnAuthorized Access"
        })
    }

    let decoded
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
    const userId = decoded.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message: "Post not found"
        })
    }
    if(post.user.toString() !== userId){
        return res.status(403).json({
            message: "You are not authorized to access this post"
        })
    }
    res.status(200).json({
        message: "Post details fetched successfully",
        post
    })
}




module.exports = { createPostController, getPostsController, getPostDetailsController } 
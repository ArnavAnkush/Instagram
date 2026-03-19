
const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

 async function registerController(req, res){
    const { email, username, password, bio, profilePicture } = req.body 

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists: " + (isUserAlreadyExists.email == email ? "Email already exists" : "Username already exists")
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profilePicture 
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token)

    res.status(201).json({
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture
        }
    })
}

async function loginController(req, res) {
    const {username, email, password} = req.body

    /*
    1. username
    2. password
    3. email
    4. password
    */ 

    const user = await userModel.findOne({
        $or:[
            {username:username},
            {email:email}
        ]
    })
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }
    const isPassWordValid = await bcrypt.compare(password, user.password)
    if(!isPassWordValid){
        return res.status(401).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("token", token)
    res.status(200).json({
        message: "Login successful",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture
        }
    })
}

module.exports = {
    registerController,
    loginController
}
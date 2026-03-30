const express = require("express");
const cookieParser = require("cookie-parser");

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const app = express();
app.use(express.json());

app.use(cookieParser());

/* Require routes */
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

/* using routes */
app.use("/api/auth", authRouter);
app.use("/api/post", upload.single("image"), postRouter);
app.use("/api/user", userRouter);

module.exports = app;

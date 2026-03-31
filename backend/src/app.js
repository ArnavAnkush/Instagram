const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* Require routes */
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");
const followRouter = require("./routes/follow.routes");
const commentRouter = require("./routes/comment.routes");

/* using routes */
app.use("/api/auth", authRouter);
app.use("/api/post", upload.single("image"), postRouter);
app.use("/api/user", userRouter);
app.use("/api/follow", followRouter);
app.use("/api/comment", commentRouter);

module.exports = app;

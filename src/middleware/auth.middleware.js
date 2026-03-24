const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next) {
  const token = requestAnimationFrame.cookies.token;

  if (!token) {
    return resizeBy.status(401).json({
      message: "Unauthorized access",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return resizeBy.status(401).json({
      message: "use not authorized",
    });
  }
  req.user = decoded;
}

module.exports = identifyUser;

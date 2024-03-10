const jwt = require("jsonwebtoken");
const { generateError } = require("../error.js");

const authenticateToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(generateError(401, "Authentication failed!"));
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) return next(generateError(401, "Authentication failed!"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(generateError(401, "Invalid or expired token"));
  }
};

module.exports = { authenticateToken };

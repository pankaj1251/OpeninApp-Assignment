const express = require("express");
const { registerUser, getUserInfo } = require("../controllers/User.js");

const router = express.Router();

router.post("/register", registerUser);
router.get("/:id", getUserInfo);

module.exports = router;

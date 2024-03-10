const express = require("express");
const { authenticateToken } = require("../middlewares/authentication.js");
const {
  addTask,
  removeTask,
  getUserTasks,
  modifyTask,
} = require("../controllers/Tasks.js");

const router = express.Router();

router.post("/", authenticateToken, addTask);
router.get("/", authenticateToken, getUserTasks);
router.patch("/:task_id", authenticateToken, modifyTask);
router.delete("/:task_id", authenticateToken, removeTask);

module.exports = router;

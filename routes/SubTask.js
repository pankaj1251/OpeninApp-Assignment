const express = require("express");
const { authenticateToken } = require("../middlewares/authentication.js");
const {
  addSubTask,
  removeSubTask,
  getUserSubTasks,
  modifySubTask,
} = require("../controllers/SubTask.js");

const router = express.Router();

router.post("/", authenticateToken, addSubTask);
router.get("/", authenticateToken, getUserSubTasks);
router.patch("/:subtask_id", authenticateToken, modifySubTask);
router.delete("/:subtask_id", authenticateToken, removeSubTask);

module.exports = router;

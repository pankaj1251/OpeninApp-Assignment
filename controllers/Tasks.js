const TaskModified = require("../models/Tasks.js");
const SubTaskModified = require("../models/Subtasks.js");
const { generateError } = require("../error.js");

// CREATE NEW TASK FOR A USER
const addTask = async (req, res, next) => {
  try {
    const { taskTitle, taskDescription, dueDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(generateError(404, "User not found!"));
    }

    // Validate input
    if (!taskTitle || !taskDescription || !dueDate) {
      return next(
        generateError(400, "Title, description, and due date are required.")
      );
    }

    // Create a new task
    const newTask = new TaskModified({
      taskTitle,
      taskDescription,
      dueDate,
      userId,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    return res
      .status(201)
      .json({ message: "Task created successfully.", task: savedTask });
  } catch (error) {
    return next(generateError(error.statusCode, error.message));
  }
};

// GET ALL USER TASKS WITH FILTERS AND PAGINATION
const getUserTasks = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const { priority, status, dueDate, page, limit } = req.query;

    if (!userId) {
      return next(generateError(404, "User not found!"));
    }

    // Build filter object
    const filter = { userId, deletedAt: null };
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) }; // Assumed dueDate is in format 'YYYY-MM-DD'

    // Implement pagination
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };

    // Fetch tasks based on filter and pagination
    const tasks = await TaskModified.paginate(filter, options);

    return res.json(tasks);
  } catch (error) {
    return next(generateError(error.statusCode, error.message));
  }
};

// UPDATE TASK dueDate AND status
const modifyTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { dueDate, status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(generateError(404, "User not found!"));
    }

    // Validate input
    if (!taskId) {
      return next(generateError(400, "Task ID is required."));
    }

    // Find the task by ID
    const task = await TaskModified.findById(taskId);

    // Check if the task exists
    if (!task) {
      return next(generateError(404, "Task not found."));
    }

    if (task?.deletedAt != null) {
      return next(generateError(400, `Task was deleted on: ${task?.deletedAt}`));
    }

    //Check if task delongs to the user
    if (task.userId != userId) {
      return next(generateError(401, "You can't update this task!"));
    }

    // Update dueDate and status if provided
    if (dueDate) {
      task.dueDate = dueDate;
    }
    if (status) {
      task.status = status;
    }

    // Save the updated task
    await task.save();

    res.json({ message: "Task updated successfully.", task });
  } catch (error) {
    return next(
      generateError(error.statusCode || 500, error.message || "Internal Server Error")
    );
  }
};

// DELETE A TASK
const removeTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(generateError(404, "User not found!"));
    }

    // Validate input
    if (!taskId) {
      return next(generateError(400, "Task ID is required."));
    }

    // Find the task by ID
    const task = await TaskModified.findById(taskId);

    // Check if the task exists
    if (!task) {
      return next(generateError(404, "Task not found."));
    }

    if (task?.deletedAt != null) {
      return next(
        generateError(400, `Task already deleted on: ${task?.deletedAt}`)
      );
    }

    // Check if task belongs to user
    if (task?.userId != userId) {
      return next(generateError(401, "You can't delete this task!"));
    }

    // Find and soft delete all associated subtasks
    const subtasks = await SubTaskModified.find({ parentTaskId: task._id });

    for (const subtask of subtasks) {
      subtask.deletedAt = new Date();
      await subtask.save();
    }

    // Perform soft delete by updating deletedAt field
    task.deletedAt = new Date();

    // Save the updated task
    await task.save();

    return res.json({ message: "Task deleted successfully.", task });
  } catch (error) {
    return next(
      generateError(error.statusCode || 500, error.message || "Internal Server Error")
    );
  }
};

module.exports = { addTask, getUserTasks, modifyTask, removeTask };

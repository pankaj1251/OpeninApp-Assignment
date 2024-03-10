const SubTaskModified = require("../models/Subtasks.js");
const { generateError } = require("../error.js");
const TaskModified = require("../models/Tasks.js");

// CREATE A NEW SUB TASK FOR A TASK
const addSubTask = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const user = req.user;
    if (!user) {
      return next(generateError(401, "User not found!"));
    }

    // Validate input
    if (!taskId) {
      return next(generateError(404, "Task ID is required."));
    }

    // Create a new sub task
    const newSubTask = new SubTaskModified({
      parentTaskId: taskId,
    });

    // Save the sub task to the database
    const savedSubTask = await newSubTask.save();
    await updateTaskStatus(taskId);

    await res.status(201).json({
      message: "Subtask created successfully.",
      subTask: savedSubTask,
    });
  } catch (error) {
    return next(generateError(error.statusCode, error.message));
  }
};

// GET ALL USER SUB_TASKS AND OPTION TO FILTER BY task_id
const getUserSubTasks = async (req, res, next) => {
  try {
    const user = req.user;
    const { taskId } = req.query;

    if (!user) {
      return next(generateError(401, "User not found!"));
    }

    let filter = {};
    if (!taskId) {
      // Find all tasks associated with the user
      const tasks = await TaskModified.find({ userId: user.id });

      // Create a filter to get all subtasks associated with the user's tasks
      const taskIds = tasks.map((task) => task._id);
      filter =
        taskIds.length > 0
          ? { parentTaskId: { $in: taskIds }, deletedAt: null }
          : { deletedAt: null };
    } else {
      filter = { parentTaskId: taskId, deletedAt: null };
    }

    const subTasks = await SubTaskModified.find(filter);

    return res.json({ subTasks });
  } catch (error) {
    return next(
      generateError(error.statusCode || 500, error.message || "Internal Server Error")
    );
  }
};

// UPDATE SUB TASK
const modifySubTask = async (req, res, next) => {
  try {
    const { subtaskId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(generateError(404, "User not found!"));
    }

    // Validate input
    if (!subtaskId) {
      return next(generateError(400, "Subtask ID is required."));
    }

    // Find the subtask by ID
    const subtask = await SubTaskModified.findById(subtaskId);

    // Check if the subtask exists
    if (!subtask) {
      return next(generateError(404, "Subtask not found."));
    }

    if (subtask?.deletedAt != null) {
      return next(
        generateError(400, `Subtask was deleted on: ${subtask?.deletedAt}`)
      );
    }

    //Check if the subtask belongs to user
    const task = await TaskModified.findById(subtask.parentTaskId);
    if (!task) {
      return next(generateError(404, "Task not found for this subtask"));
    }
    if (task?.userId != userId) {
      return next(generateError(401, "You can't update this subtask!"));
    }

    if (status !== undefined) {
      // Update the subtask status if provided
      subtask.taskStatus = status;
    }

    // Save the updated subtask
    await subtask.save();

    await updateTaskStatus(subtask.parentTaskId);

    res.json({ message: "Subtask updated successfully.", subtask });
  } catch (error) {
    return next(
      generateError(error.statusCode || 500, error.message || "Internal Server Error")
    );
  }
};

// SOFT DELETE SUB_TASK
const removeSubTask = async (req, res, next) => {
  try {
    const { subtaskId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(generateError(404, "User not found!"));
    }

    // Validate input
    if (!subtaskId) {
      return next(generateError(400, "Subtask ID is required."));
    }

    // Find the subtask by ID
    const subtask = await SubTaskModified.findById(subtaskId);

    // Check if the subtask exists
    if (!subtask) {
      return next(generateError(404, "Subtask not found."));
    }
    if (subtask?.deletedAt != null) {
      return next(
        generateError(400, `Subtask already deleted on: ${subtask?.deletedAt}`)
      );
    }

    //Check if the subtask belongs to user
    const task = await TaskModified.findById(subtask.parentTaskId);
    if (!task) {
      return next(generateError(404, "Task not found for this subtask"));
    }
    if (task?.userId != userId) {
      return next(generateError(401, "You can't delete this subtask!"));
    }

    // Perform soft delete by updating deletedAt field
    subtask.deletedAt = new Date();

    // Save the updated subtask
    await subtask.save();
    await updateTaskStatus(subtask.parentTaskId);

    res.json({ message: "Subtask deleted successfully.", subtask });
  } catch (error) {
    return next(
      generateError(error.statusCode || 500, error.message || "Internal Server Error")
    );
  }
};

// UTIL Functions

// Function to update the task status based on subtasks
const updateTaskStatus = async (taskId) => {
  try {
    const task = await TaskModified.findById(taskId);
    if (!task) {
      throw generateError(404, "Task not found.");
    }

    const subtasks = await SubTaskModified.find({ parentTaskId: taskId, deletedAt: null });

    if (subtasks.every((subtask) => subtask.taskStatus === 1)) {
      task.taskStatus = "DONE";
    } else if (subtasks.some((subtask) => subtask.taskStatus === 1)) {
      task.taskStatus = "IN_PROGRESS";
    } else {
      task.taskStatus = "TO_DO";
    }

    // Save the updated task status
    await task.save();
  } catch (error) {
    throw generateError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

module.exports = { addSubTask, getUserSubTasks, modifySubTask, removeSubTask };

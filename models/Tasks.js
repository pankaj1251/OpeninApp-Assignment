const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    taskPriority: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    taskStatus: {
      type: String,
      enum: ["TO_DO", "IN_PROGRESS", "DONE"],
      default: "TO_DO",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModified",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.plugin(mongoosePaginate);

const TaskModified = mongoose.model("TaskModified", taskSchema);
module.exports = TaskModified;

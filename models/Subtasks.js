const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema(
  {
    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskModified",
      required: true,
    },
    taskStatus: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const SubTaskModified = mongoose.model("SubTaskModified", subTaskSchema);
module.exports = SubTaskModified;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    userPriority: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
  },
  { timestamps: true }
);

const UserModified = mongoose.model("UserModified", userSchema);
module.exports = UserModified;

const UserModified = require("../models/User.js");
const { generateError } = require("../error.js");
const jwt = require("jsonwebtoken");

// CREATE NEW USER
const registerUser = async (req, res, next) => {
  try {
    const { phoneNumber, priority } = req.body;

    // Validate input
    if (
      phoneNumber === null ||
      phoneNumber === undefined ||
      priority === null ||
      priority === undefined
    ) {
      return next(generateError(400, "Phone number and priority are required."));
    }

    const checkUser = await UserModified.findOne({ phoneNumber });
    if (checkUser) {
      return next(
        generateError(400, "User Already exists with this phone number!")
      );
    }

    // Create a new user with phoneNumber
    const newUser = new UserModified({
      phoneNumber,
      priority,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1 year",
    });

    res
      .status(201)
      .json({ message: "User created successfully.", user: newUser, token });
  } catch (error) {
    return next(generateError(error.statusCode, error.message));
  }
};

// GET THE USER DETAILS
const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Validate user ID
    if (!userId) {
      return next(generateError(400, "User ID is required."));
    }

    // Find user by ID
    const user = await UserModified.findById(userId);

    // Check if user exists
    if (!user) {
      return next(generateError(404, "User not found."));
    }

    res.json(user);
  } catch (error) {
    return next(generateError(500, "Internal Server Error"));
  }
};

module.exports = { registerUser, getUserInfo };

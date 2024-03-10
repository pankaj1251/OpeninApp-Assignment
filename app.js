const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const userRoute = require("./routes/User.js");
const taskRoute = require("./routes/Task.js");
const subTaskRoute = require("./routes/SubTask.js");
const priorityCronJob = require("./cron-jobs/priorityCronJob.js");
const callDueCronJob = require("./cron-jobs/callDueCronJob.js");

const app = express();
dotenv.config();


app.use(express.json());

const corsConfig = {
  credentials: true,
  origin: true,
};


app.use(cors(corsConfig));
app.use(morgan("tiny")); //

const port = process.env.PORT || 3000;

const connectToDatabase = () => {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(process.env.MONGODB_URI) 
      .then(() => {
        console.log("MongoDB connected successfully"); 
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
      });
  };


app.use("/api/user/", userRoute);
app.use("/api/task/", taskRoute);
app.use("/api/sub-task/", subTaskRoute);

// Chron Jobs
priorityCronJob.start();
callDueCronJob.start();

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  });


  app.listen(port, () => {
    console.log("Server started on port", port); // Improved server start message
    connectToDatabase();
  });

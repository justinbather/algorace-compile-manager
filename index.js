const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const addTask = require("./queue/send");
const cookieParser = require("cookie-parser");
const CompileJob = require("./schemas/CompileJobSchema");
const { PORT } = require('./config/constants')

//Connects to MongoDB
connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));


// @description: Handles creation of CompileJob, adds to task queue and returns the jobId to client
app.post("/compile", async (req, res) => {

  const compileJob = await CompileJob.create({
    status: "pending",
    code: req.body.code,
    problem: req.body.problem,
  });

  //the queue needs to be given data in string format to be sent as a buffer
  const data = JSON.stringify({
    jobId: compileJob._id,
    code: req.body.code,
    problem: req.body.problem,
  });

  addTask(data, function(success, data) {
    if (!success) {
      return res.status(500).json({ success: false, error: data });
    } else {
      return res.status(200).json({ success: true, jobId: compileJob._id });
    }
  });
});


//@description: Updates compileJob upon completion by worker
app.patch("/compile", async (req, res) => {
  try {
    const updatedJob = await CompileJob.findByIdAndUpdate(
      req.body.jobId,
      req.body.update
    );
    return res.sendStatus(200)
  } catch (err) {
    console.log("error updating compile job from remote compiler", err);
  }
});


// @description: Provides status and output for given CompileJob
app.get("/job-status/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const compileJob = await CompileJob.findById(jobId);

    if (!compileJob) {
      return res.status(400).json({ message: "Job not found with that ID" });
    }

    switch (compileJob.status) {
      case "pending": {
        return res.status(200).json({ status: "pending", jobId: jobId });
      }
      case "completed": {
        return res.status(200).json({
          status: "completed",
          success: true,
          jobId: jobId,
          output: compileJob.output,
        });
      }
      case "failed": {
        return res.status(200).json({
          status: "failed",
          success: false,
          jobId: jobId,
          output: compileJob.output,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Error finding job", error: err });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

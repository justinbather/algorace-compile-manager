const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const addTask = require("./queue/send");
const verifyUser = require("./middleware/verifyUser");
const cookieParser = require("cookie-parser");
const CompileJob = require("./schemas/CompileJobSchema");

connectDB();

const app = express();
const PORT = process.env.PORT || 7070;

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'https://algorace-frontend.vercel.app', credentials: true }));

app.post("/compile", verifyUser, async (req, res) => {
  console.log("recieved post");
  //fetch the problemcode with id from client
  // client gives userCode and rest of info

  const compileJob = await CompileJob.create({
    user: req.user,
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
      console.log("returning after success");
      return res.status(200).json({ success: true, jobId: compileJob._id });
    }
  });
});

app.patch("/compile", async (req, res) => {
  try {
    const updatedJob = await CompileJob.findByIdAndUpdate(
      req.body.jobId,
      req.body.update
    );
    console.log("Getting update from worker service");
  } catch (err) {
    console.log("error updating compile job from remote compiler", err);
  }
});

app.get("/job-status/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const compileJob = await CompileJob.findById(jobId);
    console.log(compileJob.status);

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

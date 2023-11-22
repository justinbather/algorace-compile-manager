const express = require('express')
const addTask = require('../queue/send')
const CompileJob = require('../schemas/CompileJobSchema')

const router = express.Router()

// @description: Handles creation of CompileJob, adds to task queue and returns the jobId to client
router.post("/", async (req, res) => {

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
router.patch("/", async (req, res) => {
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

module.exports = router

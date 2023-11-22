const express = require('express')
const CompileJob = require('../schemas/CompileJobSchema')

const router = express.Router()

router.get("/:jobId", async (req, res) => {
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

module.exports = router

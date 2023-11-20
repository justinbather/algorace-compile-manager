const mongoose = require("mongoose");

const CompileJobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: () => ({})
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  code: {
    type: String,
  },
  problem: {
    type: String,
  },
  output: {
    type: String,
    default: "",
  },
});

const CompileJob = mongoose.model("Compile Job", CompileJobSchema);
module.exports = CompileJob;

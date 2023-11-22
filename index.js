const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const CompileJob = require("./schemas/CompileJobSchema");

//Route imports
const compile = require('./routes/compile')
const job = require('./routes/job')

const { PORT } = require('./config/constants')

//Connect to MongoDB Server
connectDB();

const app = express();

//Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// @description: Handles creation of CompileJob, adds to task queue and returns the jobId to client
app.use('/compile', compile)
// @description: Provides status and output for given CompileJob
app.use("/job-status", job)


app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

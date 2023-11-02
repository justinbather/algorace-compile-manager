const express = require("express");
const axios = require("axios");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.post("/test", async (req, res) => {
  console.log("recieved post");
  //fetch the problemcode with id from client
  // client gives userCode and rest of info

  console.log(req.body);
  try {
    const response = await axios.post("http://localhost:5050/compile-test", {
      code: req.body.code,
      problem: req.body.problem,
    });
    if (response.status === 200) {
      switch (response.data.success) {
        case true: {
          return res
            .status(200)
            .json({ success: true, output: response.data.output });
        }
        case false: {
          return res
            .status(200)
            .json({ success: false, output: response.data.output });
        }
        default: {
          return res
            .status(500)
            .json({ message: "Error compiling", success: false });
        }
      }
      // console.log(response.data);
      // console.log("got response");
      // return res.status(200).json({
      //   message: "successful compilation",
      //   worker_response: response.data,
      // });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error making request to worker", error: err });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

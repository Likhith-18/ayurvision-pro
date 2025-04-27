import express from "express";
import cors from "cors";
import path from "path";
import { fork, spawn, exec } from "child_process";
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
const __dirname = path.resolve();

const getPrakriti = (dataToSend, res) => {
  const pythonProcess = fork("./child.js");

  console.log("running inside getPrakriti");
  const data = dataToSend.data;
  console.log(dataToSend);
  pythonProcess.send({ data: dataToSend });

  // Listen for messages from the child process
  pythonProcess.on("message", (message) => {
    if (message.error) {
      console.error(`stderr in child: ${message.error}`);
      res.status(500).send("Internal Server Error");
    } else {
      console.log(message.data);
      // res.status(200).send("Success");
    }
  });

  // Handle child process exit
  pythonProcess.on("exit", (code) => {
    console.log(`child process exited with code ${code}`);
    try {
      // Handle received data as needed
      res.status(200).json({ success: true, data: dataToSend });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  });

  const virtualEnvPath = path.resolve(__dirname, ".venv");
  // const activateScript =
  //   process.platform == "win32"
  //     ? path.join(virtualEnvPath, "Scripts", "activate")
  //     : path.join("source", virtualEnvPath, "bin", "activate");
  const activateScript = path.join("source", virtualEnvPath, "bin", "activate");
  // console.log(activateScript);
  const activateProcess = exec(activateScript, { shell: true });
  activateProcess.stdout.on("data", (data) => {
    console.log(`stdout (activate): ${data}`);
  });

  activateProcess.stderr.on("data", (data) => {
    console.error(`stderr (activate): ${data}`);
  }); /////

  activateProcess.on("close", (code) => {
    console.log(`child process (activate) exited with code ${code}`);
    const pythonProcess = fork("./child.js");

    console.log("running inside getPrakriti");
    const data = dataToSend.data;
    console.log(dataToSend);
    pythonProcess.send({ data: dataToSend });

    // Listen for messages from the child process
    pythonProcess.on("message", (message) => {
      if (message.error) {
        console.error(`stderr in child: ${message.error}`);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(message.data);
        // res.status(200).send("Success");
      }
    });

    // Handle child process exit
    pythonProcess.on("exit", (code) => {
      console.log(`child process exited with code ${code}`);
      try {
        // Handle received data as needed
        res.status(200).json({ success: true, data: dataToSend });
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error");
      }
    });
  });
};

const updatePrakriti = async (dataToSend, res) => {
  try {
    const response = await axios.post("http://localhost:8000/update-prakriti", {
      prakriti: dataToSend,
    });
    console.log("Update Prakriti response:", response.data);
    res.status(200).json({ success: true, data: dataToSend });
  } catch (error) {
    console.error("Error updating Prakriti:", error);
    res.status(500).send("Internal Server Error");
  }
};

app.post("/chatbot", async (req, res) => {
  console.log("prakriti request send");
  let input_data = req.query.msg || "";
  await updatePrakritiPrakriti(input_data, res);
});

app.post("/predict", (req, res) => {
  console.log("Request received");
  // Receive input data from client
  const inputData = req.body;
  // const pythonExecutable = path.resolve(__dirname, ".venv", "bin", "python");
  // Spawn child process
  const pythonProcess = spawn("python3", ["./model.py"]);
  // const pythonProcess = spawn(pythonExecutable, ["./model.py"]);

  // Send input data to child process
  pythonProcess.stdin.write(JSON.stringify(inputData));
  pythonProcess.stdin.end();

  let dataToSend = "";

  // Listen for output from child process
  pythonProcess.stdout.on("data", (data) => {
    dataToSend += data.toString();
  });
  pythonProcess.stdout.on("error", (err) => {
    console.error("Error in stdout:", err);
  });

  //Handle errors in stderr
  pythonProcess.stderr.on("data", (data) => {
    console.error("Error in stderr:", data.toString());
  });

  pythonProcess.on("close", async (code) => {
    console.log(`child process close all stdio with code ${code}`);
    console.log(dataToSend);

    try {
      res.status(200).json(dataToSend);
      await updatePrakriti({ prakriti: dataToSend });
    } catch (error) {
      console.error("Error:", error.msg);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

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
  const virtualEnvPath = path.resolve(__dirname, "..", ".venv");
  const activateScript =
    process.platform == "win32"
      ? path.join(virtualEnvPath, "Scripts", "activate.bat")
      : path.join("source", virtualEnvPath, "bin", "activate");
  // const activateScript = escape(activateScript1);
  console.log(activateScript);
  console.log(dataToSend);

  // const activateProcess = exec(activateScript, [], { shell: true });
  exec(activateScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error activating virtual environment: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }

    console.log(`Virtual environment activated: ${stdout}`);

    // const args = [JSON.stringify(dataToSend.data)];
    const childProcess = fork("./child1.js");
    childProcess.send(dataToSend);
    // childProcess.on("message", (data) => {
    //   console.log(data.toString());
    //   // res.status(200).json(data);
    // });
    childProcess.on("message", (data) => {
      console.error(`Message from child: ${data.toString()}`);
    });

    childProcess.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
      res.status(200).json({ success: true });
    });
    // Listening for child process errors
    childProcess.on("error", (err) => {
      console.error(`Failed to start child process: ${err.message}`);
      res.status(500).json({ success: false });
    });
  });
};

// activateProcess.stdout.on("data", (data) => {
//   console.log(`stdout (activate): ${data}`);
// });

// activateProcess.stderr.on("data", (data) => {
//   console.error(`stderr (activate): ${data}`);
// });

// activateProcess.on("close", (code) => {
//   console.log(`child process (activate) exited with code ${code}`);
//   const pythonProcess = spawn("./child.js", []);

//   console.log("running inside getPrakriti");
//   const data = dataToSend.data;
//   console.log(dataToSend);
//   pythonProcess.send({ data: dataToSend });

//   // Listen for messages from the child process
//   pythonProcess.on("message", (message) => {
//     if (message.error) {
//       console.error(`stderr in child: ${message.error}`);
//       res.status(500).send("Internal Server Error");
//     } else {
//       console.log(message.data);
//       // res.status(200).send("Success");
//     }
//   });

// Handle child process exit
//     pythonProcess.on("exit", (code) => {
//       console.log(`child process exited with code ${code}`);
//       try {
//         // Handle received data as needed
//         res.status(200).json({ success: true, data: dataToSend });
//       } catch (error) {
//         console.error("Error:", error.message);
//         res.status(500).send("Internal Server Error");
//       }
//     });
//   });
// };

app.post("/chatbot", (req, res) => {
  console.log("prakriti request send");
  let input_data = req.query.msg || "";
  console.log("from post chatbot: ", input_data);

  getPrakriti(input_data, res);
});

app.post("/predict", (req, res) => {
  //   console.log("Request received");
  const inputData = req.body;
  const pythonExecutable = path.resolve(
    __dirname,
    "..",
    ".venv",
    "Scripts",
    "python.exe"
  );

  const pythonProcess = spawn(pythonExecutable, ["./model.py"]);

  pythonProcess.stdin.write(JSON.stringify(inputData));
  pythonProcess.stdin.end();

  var dataToSend = "";

  pythonProcess.stdout.on("data", (data) => {
    dataToSend = data.toString();
  });
  pythonProcess.stdout.on("error", (err) => {
    console.error("Error in stdout:", err);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Error in stderr:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    console.log(dataToSend);

    try {
      res.status(200).json({ success: true, data: dataToSend });
    } catch (error) {
      console.error("Error:", error.msg);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

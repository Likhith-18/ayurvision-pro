import express from "express";
import cors from "cors";
import path from "path";
// import { createProxyMiddleware } from "http-proxy-middleware";
import { fork, spawn } from "child_process";
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
const __dirname = path.resolve();
// app.use((req, res, next) => {
//   res.setHeader("X-Frame-Options", "ALLOW-FROM http://localhost:5173");
//   res.setHeader(
//     "Content-Security-Policy",
//     "frame-ancestors 'self' http://localhost:5173"
//   );
//   next();
// });
// app.use(
//   "/chainlit",
//   createProxyMiddleware({ target: "http://localhost:8000", changeOrigin: true })
// );

const getPrakriti = (dataToSend, res) => {
  // const venv = "../.venv/Scripts/activate.bat";

  // const activateCommand =
  //   process.platform === "win32" ? "Scripts\\activate.bat" : "bin/activate";
  // const virtualEnvPath = path.join(__dirname, "..", "..", ".venv"); // Path to the virtual environment directory

  // Full path to the virtual environment activation script
  // const activateScript = path.join(virtualEnvPath, activateCommand);
  // const activateCommand =
  //   process.platform === "win32" ? "Scripts\\activate.bat" : "bin/activate";
  // const virtualEnvPath = path.join(__dirname, "..", "..", ".venv"); // Path to the virtual environment directory

  // Full path to the virtual environment activation script
  // const activateScript = path.join(virtualEnvPath, activateCommand);

  const virtualEnvPath = path.resolve(__dirname, "..", ".venv");
  const activateScript = path.join(virtualEnvPath, "Scripts", "activate");
  // const activateProcess = spawn(activateScript, [], { shell: true });
  console.log(activateScript);
  const activateProcess = spawn(activateScript, [], { shell: true });
  activateProcess.stdout.on("data", (data) => {
    console.log(`stdout (activate): ${data}`);
  });

  activateProcess.stderr.on("data", (data) => {
    console.error(`stderr (activate): ${data}`);
  });

  activateProcess.on("close", (code) => {
    console.log(`child process (activate) exited with code ${code}`);
    // const pythonProcess = spawn(command, args);

    // // Handle stdout, stderr, and process close events for the command process
    // pythonProcess.stdout.on("data", (data) => {
    //   console.log(`stdout (command): ${data}`);
    // });

    // pythonProcess.stderr.on("data", (data) => {
    //   console.error(`stderr (command): ${data}`);
    // });

    // pythonProcess.on("close", (code) => {
    //   console.log(`child process (command) exited with code ${code}`);
    // });

    // const virtualEnvPath = path.resolve(__dirname, "..", ".venv");
    // const activateScript = path.join(virtualEnvPath, "Scripts", "chainlit.exe");
    // console.log(virtualEnvPath);
    // console.log(activateScript);
    // // const pythonProcess = spawn(activateScript, [
    // //   "run",
    // //   "../rag-chatbot/app.py",
    // //   dataToSend,
    // // ]);
    // const pythonProcess = spawn("uv", ["pip", "show", "chainlit"], {
    //   shell: true,
    // });
    // console.log("running inside getPrakriti", dataToSend);
    // // pythonProcess.stdout.on("data", (data) => {
    // //   receivedData = data.toString();
    // // });
    // pythonProcess.stdout.on("data", (data) => {
    //   console.log(data);
    //   // dataToSend += data.toString();
    // });

    // pythonProcess.stderr.on("data", (data) => {
    //   console.error(`stderr: ${data}`);
    // });

    // pythonProcess.on("close", (code) => {
    //   console.log(`child process closed all stdio with code ${code}`);
    //   console.log(dataToSend);
    //   try {
    //     // Handle received data as needed
    //     res.status(200).json({ result: dataToSend });
    //   } catch (error) {
    //     console.error("Error:", error.message);
    //     res.status(500).send("Internal Server Error");
    //   }
    // });
    const pythonProcess = fork("./child.js");

    console.log("running inside getPrakriti");

    // Listen for messages from the child process
    pythonProcess.on("message", (message) => {
      if (message.error) {
        console.error(`stderr: ${message.error}`);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(message.data);
        dataToSend.result = message.data;
      }
    });

    // Handle child process exit
    pythonProcess.on("exit", (code) => {
      console.log(`child process exited with code ${code}`);
      try {
        // Handle received data as needed
        res.status(200).json(dataToSend);
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error");
      }
    });
  });
};
app.post("/chatbot", (req, res) => {
  console.log("prakriti request send");
});

app.get("/chatbot", (req, res) => {
  console.log("prakriti request send");
  const input_data = req.query.msg;
  getPrakriti(input_data, res);
});

app.post("/predict", (req, res) => {
  console.log("Request received");
  // Receive input data from client
  const inputData = req.body;

  // Spawn child process
  const pythonProcess = spawn("python", ["model.py"]);

  // Send input data to child process
  pythonProcess.stdin.write(JSON.stringify(inputData));
  pythonProcess.stdin.end();

  var dataToSend = "";

  // Listen for output from child process
  pythonProcess.stdout.on("data", (data) => {
    dataToSend = data.toString();
  });
  pythonProcess.stdout.on("error", (err) => {
    console.error("Error in stdout:", err);
  });

  // Handle errors in stderr
  // pythonProcess.stderr.on("data", (data) => {
  //   console.error("Error in stderr:", data.toString());
  // });

  pythonProcess.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    console.log(dataToSend);
    // getPrakriti({ prakriti: dataToSend });

    try {
      console.log(dataToSend);
      res.redirect(`/chatbot?msg=${encodeURIComponent(dataToSend)}`);
    } catch (error) {
      console.error("Error:", error.msg);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

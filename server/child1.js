import fkill from "fkill";
import { exec, spawn } from "child_process";
import path from "path";
import fs from "fs";
import isPortReachable from "is-port-reachable";

const __dirname = path.resolve();
let chainlitProcess = null;
const port = 8000;
const host = "127.0.0.1";

// Check if port 8000 is occupied and kill the process if necessary
const killPortIfNecessary = async () => {
  const reachable = await isPortReachable(port, { host });
  if (reachable) {
    console.log(`Port ${port} is open, killing the process on it.`);
    await fkill(":8000", { force: true });
  } else {
    console.log(`Port ${port} is closed.`);
  }
};

// Start Chainlit process
const startChainlitProcess = (appPath, envPath, dataToSend) => {
  // Update the .env file with new data
  const filesPath = path.resolve(__dirname, ".", ".files");
  if (!fs.existsSync(filesPath)) {
    fs.mkdirSync(filesPath, { recursive: true });
  }
  console.log(filesPath);
  let envContent = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8")
    : "";

  console.log(dataToSend);

  const newLine = `PRAKRITI=${dataToSend}\n`;
  const regex = /^PRAKRITI=.*/m;
  envContent = regex.test(envContent)
    ? envContent.replace(regex, newLine)
    : envContent + newLine;
  fs.writeFileSync(envPath, envContent);

  // Kill the existing Chainlit process if running
  // if (chainlitProcess != null) {
  //   chainlitProcess.kill();
  // }

  // Run the Chainlit process
  const command = `chainlit run -h ${appPath}`;
  console.log("Running this command:", command);
  // chainlitProcess = exec(command, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error("Error while running Chainlit:", error);
  //     process.send({ error: stderr });
  //     return;
  //   }
  //   // Send both stdout and stderr back to the parent process
  //   process.send({ data: stdout || stderr });
  // });

  chainlitProcess = spawn("chainlit", ["run", "-h", appPath]);

  chainlitProcess.stdout.on("data", (data) => {
    console.log(`Chainlit stdout: ${data}`);
    // process.stdout.write(data);
  });

  chainlitProcess.stderr.on("data", (data) => {
    console.error(`Chainlit stderr: ${data}`);
    // process.stderr.write(data);
  });

  chainlitProcess.on("close", (code) => {
    console.log(`Chainlit process exited with code ${code}`);
  });

  // Handle errors
  chainlitProcess.on("error", (err) => {
    console.error(`Failed to start Chainlit process: ${err.message}`);
  });
};

// Main function
process.on("message", async (msg) => {
  const envPath = path.resolve(__dirname, ".", "rag-chatbot", ".env"); //todo: changes made here

  const appPath = path.resolve(__dirname, ".", "rag-chatbot", "app.py");

  // Ensure port is cleared

  await killPortIfNecessary();
  const dataToSend = msg;
  console.log(dataToSend);

  // const dataToSend = process.argv.slice(2).join(" ");
  console.log("from likhtih :", dataToSend);

  // Start the Chainlit process with the new data
  startChainlitProcess(appPath, envPath, dataToSend);
});

// Handle process exit
process.on("exit", (code) => {
  //to avoid zombie processes
  if (chainlitProcess != null) {
    chainlitProcess.kill();
  }
  console.log(`Child process exited with code ${code}`);
});

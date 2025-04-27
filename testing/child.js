// child.js
import { exec } from "child_process";

// Run the pip show chainlit command
exec("uv pip show chainlit", (error, stdout, stderr) => {
  if (error) {
    process.send({ error: stderr });
    return;
  }
  process.send({ data: stdout });
});

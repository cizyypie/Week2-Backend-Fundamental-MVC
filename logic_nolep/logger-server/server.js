import { createServer } from 'http';
import { promises as fs } from 'fs';
import { join } from 'path';
import os from 'os';

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function logRequest(req) {
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] ${req.method} ${req.url} FROM ${req.socket.remoteAddress}\n`;
  const logPath = join(process.cwd(), "requests.log"); 
  try {
    await fs.appendFile(logPath, logData);
  } catch (error) {
    console.error("Logging error:", error);
  }
}

const server = createServer(async (req, res) => {

  logRequest(req);

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home Page");
    return;
  }

  if (req.url === "/health") {
    const total = os.totalmem();
    const free = os.freemem();

    const memory = {
      total: formatBytes(total),
      used: formatBytes(total - free),
      free: formatBytes(free)
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(memory));
    return;
  }

  res.writeHead(404);
  res.end("Page Not Found");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});